import { expect, test } from '@playwright/test';
import { esperarAviso } from '../apoyo/avisos.js';
import { sql } from '../apoyo/base.js';
import { armarClub, yaConfigurada } from '../apoyo/clubPanel.js';
import { urlTienda } from '../apoyo/entorno.js';
import { ingresar } from '../apoyo/ingresar.js';
import { tiendaNueva } from '../apoyo/tiendaNueva.js';

// Lealtad L2: la tienda arma su club en el panel y la vidriera lo muestra
// solo mientras está prendido.
test('club de clientes: armar, prender, verlo en la vidriera y apagar', async ({
  page,
}) => {
  const t = await tiendaNueva('club');
  await yaConfigurada(sql, t.slug);
  await ingresar(page, urlTienda(t.slug, '/panel/ingresar'), t.email);
  await page.goto(urlTienda(t.slug, '/panel/mas'));
  await page.getByRole('link', { name: 'Club de clientes' }).click();
  await expect(page.getByRole('heading', { name: 'Club de clientes' })).toBeVisible();

  // Sin premios guardados no se puede prender.
  await page.getByRole('switch', { name: /Club prendido/ }).click();
  await expect(page.getByText('Armá al menos un premio')).toBeVisible();

  await armarClub(page);
  const tarjeta = page.getByRole('article', { name: /^Tarjeta de Club / });
  await expect(tarjeta).toContainText('A las 10: De regalo: Un café con medialunas');
  await expect(tarjeta).toContainText('Suman las compras desde $ 3.000');

  const vidriera = await page.context().newPage();
  await vidriera.goto(urlTienda(t.slug, '/'));
  const franja = vidriera.getByRole('region', { name: /^Sumá sellos con el Club / });
  await expect(franja).toContainText('20 % de descuento');
  await expect(franja.getByRole('link', { name: 'Quiero mi QR' })).toBeVisible();

  await page.getByRole('switch', { name: /Club prendido/ }).click();
  await esperarAviso(page, 'Apagaste el club');
  await vidriera.reload();
  await expect(vidriera.getByRole('heading', { name: t.nombreNegocio })).toBeVisible();
  await expect(franja).toBeHidden();
});
