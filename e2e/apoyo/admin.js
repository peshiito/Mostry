import { elegirHoy } from './fechas.js';
import { esperarAviso } from './avisos.js';
import { URL_ADMIN } from './entorno.js';

// Desde el admin: abre una tienda y registra un pago de $ 10.000 con fecha de hoy.
export async function registrarPago(page, tienda) {
  await page.goto(URL_ADMIN);
  await page.getByRole('link', { name: tienda }).first().click();
  await page.getByRole('button', { name: 'Registrar pago' }).click();
  const modal = page.getByRole('dialog');
  await modal.getByLabel('Monto').fill('10000');
  await elegirHoy(page, 'Fecha del pago');
  await modal.getByRole('button', { name: 'Registrar pago' }).click();
  await esperarAviso(page, 'Pago registrado: plan extendido');
}
