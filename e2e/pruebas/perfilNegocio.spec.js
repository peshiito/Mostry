import { expect, test } from '@playwright/test';
import { esperarAviso } from '../apoyo/avisos.js';
import { urlTienda } from '../apoyo/entorno.js';
import { ingresar } from '../apoyo/ingresar.js';
import { tiendaNueva } from '../apoyo/tiendaNueva.js';

// Mejoras 3, parte A: "solo caja" — sin tienda online ni fiados.
test('una panadería que solo quiere la caja: el panel y su link se acomodan', async ({
  page,
}) => {
  const t = await tiendaNueva('caja');
  await ingresar(page, urlTienda(t.slug, '/panel/ingresar'), t.email);
  await page.getByText('Vender por internet con mi tienda').click();
  await page.getByText('Anotar fiados de mis clientes').click();
  await page.getByRole('button', { name: 'Seguir' }).click();
  await page.getByRole('button', { name: 'Panadería o facturería' }).click();
  await page.getByRole('button', { name: 'Seguir' }).click();
  await expect(page.getByLabel('Solo marco si hay o no hay')).toBeChecked();
  await page.getByRole('button', { name: 'Seguir' }).click();
  await page.getByRole('button', { name: 'Empezar' }).click();
  await esperarAviso(page, '¡Listo! Tu Mostry quedó armado');
  await expect(page.getByText('Anotá cada venta del local')).toBeVisible();

  // Sin venta online, la pestaña de pedidos es "Vender" (parte C).
  const nav = page.getByRole('navigation', { name: 'Secciones del panel' });
  await expect(nav.getByRole('link', { name: /Pedidos/ })).toHaveCount(0);
  await nav.getByRole('link', { name: /Vender/ }).click();
  await page.getByRole('button', { name: 'Monto suelto' }).click();
  await page.getByRole('dialog').getByLabel('Monto').fill('2500');
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Agregar a la venta' })
    .click();
  await page.getByRole('radio', { name: 'Transferencia' }).click();
  await page.getByRole('button', { name: 'Cobrar $ 2.500' }).click();
  await esperarAviso(page, 'Venta #1 cobrada');

  await page.goto(urlTienda(t.slug, '/panel/mas'));
  await expect(page.getByRole('link', { name: /Gastos/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Libreta/ })).toHaveCount(0);

  // Su link es una tarjeta de presentación, sin catálogo.
  await page.goto(urlTienda(t.slug, '/catalogo'));
  await expect(page.getByRole('heading', { name: t.nombreNegocio })).toBeVisible();
  await expect(page.getByPlaceholder('Buscá en la tienda…')).toHaveCount(0);
});
