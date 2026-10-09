import { elegirHoy } from '../apoyo/fechas.js';
import { expect, test } from '@playwright/test';
import { pedidoDeComprador } from '../apoyo/api.js';
import { esperarAviso } from '../apoyo/avisos.js';
import { urlTienda } from '../apoyo/entorno.js';
import { SESION_ROSA } from '../apoyo/ingresar.js';

test.use({ storageState: SESION_ROSA });

const revisar = async (page, cliente) => {
  await page.goto(urlTienda('dona-rosa', '/panel/pedidos'));
  await page.getByText(cliente).click();
  await page.getByRole('link', { name: /Revisar comprobante/ }).click();
  await expect(page.getByRole('heading', { name: 'Revisar comprobante' })).toBeVisible();
};

// La comerciante revisa lo que le transfirieron (CLAUDE.md 6.1).
test('aprobar un comprobante: carga los datos y el pago entra a la caja', async ({
  page,
}) => {
  await pedidoDeComprador('dona-rosa', 'Vigilante', 'Lucía Gómez');
  await revisar(page, 'Lucía Gómez');
  await page.getByLabel('Monto que te llegó').fill('400');
  await elegirHoy(page, 'Fecha de la operación');
  await page.getByLabel('Titular que pagó').fill('Lucía Gómez');
  await page.getByLabel('Número de operación').fill('482913');
  await page.getByRole('button', { name: 'Aprobar pago' }).click();
  await esperarAviso(page, 'Pago aprobado · entró a la caja');
  await page.goto(urlTienda('dona-rosa', '/panel/caja'));
  await expect(page.getByText(/Pago del pedido #\d+/)).toBeVisible();
  await expect(page.getByText('+$ 400')).toBeVisible();
});

test('rechazar un comprobante: con motivo, y el pedido vuelve a esperar el pago', async ({
  page,
}) => {
  await pedidoDeComprador('dona-rosa', 'Vigilante', 'Martín Sosa');
  await revisar(page, 'Martín Sosa');
  await page.getByRole('button', { name: 'Rechazar' }).click();
  const hoja = page.getByRole('dialog');
  await hoja.getByRole('button', { name: 'Monto distinto' }).click();
  await hoja
    .getByRole('textbox', { name: 'Motivo' })
    .fill('El monto no coincide con el pedido.');
  await hoja.getByRole('button', { name: 'Rechazar comprobante' }).click();
  await esperarAviso(page, 'Comprobante rechazado');
  await expect(page.getByText(/Pendiente de pago/).first()).toBeVisible();
});
