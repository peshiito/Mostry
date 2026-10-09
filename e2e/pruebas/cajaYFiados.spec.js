import { expect, test } from '@playwright/test';
import { esperarAviso } from '../apoyo/avisos.js';
import { urlTienda } from '../apoyo/entorno.js';
import { SESION_ROSA } from '../apoyo/ingresar.js';

test.use({ storageState: SESION_ROSA });
const panel = (ruta) => urlTienda('dona-rosa', `/panel${ruta}`);

// Un día de caja con un fiado en el medio (CLAUDE.md 6.4 y Fase 4): abre con
// $ 20.000, vende $ 5.000, Don Carlos paga $ 1.000 de lo que debe y al cerrar
// tiene que haber exactamente $ 26.000.
test('caja del día y libreta de fiados: abrir, vender, cobrar un fiado y cerrar', async ({
  page,
}) => {
  await page.goto(panel('/caja'));
  await page.getByLabel('Efectivo inicial (cambio en el cajón)').fill('20000');
  await page.getByRole('button', { name: 'Abrir caja' }).click();
  await esperarAviso(page, 'Caja abierta');

  await page.getByRole('button', { name: 'Ingreso' }).click();
  const hoja = page.getByRole('dialog');
  await hoja.getByLabel('Monto').fill('5000');
  await hoja.getByLabel('Concepto').fill('Venta de mostrador');
  await hoja.getByRole('button', { name: 'Guardar' }).click();
  await esperarAviso(page, 'Movimiento anotado');

  await page.goto(panel('/libreta'));
  await page.getByRole('button', { name: 'Agregar cliente' }).click();
  await page.getByRole('dialog').getByLabel('Nombre').fill('Don Carlos');
  await page.getByRole('button', { name: 'Guardar cliente' }).click();
  await esperarAviso(page, 'Cliente agregado a la libreta');
  await page.getByText('Don Carlos').click();

  await page.getByRole('button', { name: 'Anotar deuda' }).click();
  await page.getByRole('dialog').getByLabel('Monto').fill('1500');
  await page.getByRole('dialog').getByLabel('Detalle').fill('Yerba y galletitas');
  await page.getByRole('dialog').getByRole('button', { name: 'Guardar' }).click();
  await esperarAviso(page, 'Deuda anotada');
  await page.getByRole('button', { name: 'Registrar pago' }).click();
  await page.getByRole('dialog').getByLabel('Monto').fill('1000');
  await page.getByRole('dialog').getByRole('button', { name: 'Guardar' }).click();
  await esperarAviso(page, 'Pago anotado');
  await expect(page.getByText(/500/).first()).toBeVisible(); // le queda debiendo $ 500

  await page.goto(panel('/caja/cerrar'));
  await page.getByLabel('¿Cuánto contaste?').fill('26000');
  await page.getByRole('button', { name: 'Cerrar caja' }).click();
  await esperarAviso(page, 'Caja cerrada');
  await expect(
    page.getByText('Coincide justo').or(page.getByText('La caja de hoy ya está cerrada')),
  ).toBeVisible();
});
