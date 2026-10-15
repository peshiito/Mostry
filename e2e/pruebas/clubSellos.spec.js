import { expect, test } from '@playwright/test';
import { esperarAviso } from '../apoyo/avisos.js';
import { clienteDelClub, clubDeRosa, codigoQr } from '../apoyo/club.js';
import { URL_SITIO, urlTienda } from '../apoyo/entorno.js';
import { SESION_ROSA } from '../apoyo/ingresar.js';

// Lealtad L3 y L4: en el local, Rosa identifica a la clienta con su código y
// cobra (suma sellos); con 2 sellos, la clienta usa el 50 % en la tienda online
// y su tarjeta vuelve a 0.
test('club: sumar sellos en el local y usar el premio online', async ({ browser }) => {
  const rosa = await (await browser.newContext({ storageState: SESION_ROSA })).newPage();
  const ana = await (await browser.newContext()).newPage();
  await clubDeRosa(rosa);
  await clienteDelClub(ana);
  const codigo = await codigoQr(ana);

  await rosa.goto(urlTienda('dona-rosa', '/panel/vender'));
  for (let i = 1; i <= 2; i++) {
    await rosa.getByRole('button', { name: 'Monto suelto' }).click();
    await rosa.getByRole('dialog').getByLabel('Monto').fill('1500');
    await rosa
      .getByRole('dialog')
      .getByRole('button', { name: 'Agregar a la venta' })
      .click();
    await rosa.getByRole('button', { name: 'Cliente del club' }).click();
    await rosa.getByLabel('Código del cliente').fill(codigo.toLowerCase());
    await rosa.getByRole('button', { name: 'Buscar' }).click();
    await esperarAviso(rosa, `Ana Club · ${i - 1 === 1 ? '1 sello' : `${i - 1} sellos`}`);
    await rosa.getByRole('radio', { name: 'Transferencia' }).click();
    await rosa.getByRole('button', { name: /^Cobrar \$ / }).click();
    const avisos = rosa.getByRole('region', { name: 'Avisos' });
    await expect(avisos.getByText(/cobrada · sumó un sello/)).toHaveCount(i);
  }

  await ana.goto(urlTienda('dona-rosa', '/catalogo'));
  await ana.getByText('Medialuna de manteca').first().click();
  await ana.getByRole('button', { name: 'Agregar' }).click();
  await ana.getByRole('link', { name: /Continuar/ }).click();
  await expect(ana.getByText(/Comprás como Ana Club/)).toBeVisible();
  await expect(ana.getByLabel('Nombre y apellido')).toHaveValue('Ana Club');
  await ana.getByText('Retiro en el local').click();
  await ana.getByText('50 % de descuento').click();
  await expect(ana.getByText(/Premio del Club/)).toBeVisible();
  await ana.getByRole('button', { name: 'Confirmar pedido' }).click();
  await expect(ana.getByRole('heading', { name: 'Pago de tu pedido' })).toBeVisible();

  await ana.goto(`${URL_SITIO}/club/tiendas`);
  const tarjeta = ana.getByRole('article', { name: 'Tarjeta de Club Doña Rosa' });
  await expect(tarjeta).toContainText('0 / 2');
  await expect(ana.getByText(/usaste: 50 % de descuento/)).toBeVisible();
});
