import { expect, test } from '@playwright/test';
import { esperarAviso } from '../apoyo/avisos.js';
import { encargarHasta, rosaAbreElEncargo } from '../apoyo/encargo.js';

// Encargo con seña (6.2 y Encargos 2): la torta entra "por aceptar"; Rosa la
// acepta y recién ahí el cliente paga el 30 % de seña.
test('encargo de torta con seña: se acepta y después se paga la seña', async ({
  page,
  browser,
}) => {
  await encargarHasta(page, 'Rogel', 'Valeria Luna');
  await page.getByRole('button', { name: 'Confirmar encargo' }).click();
  await expect(
    page.getByText('Esperando que Facturería Doña Rosa acepte tu encargo'),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'Pagar y subir comprobante' })).toHaveCount(
    0,
  );

  const { rosa, contexto } = await rosaAbreElEncargo(browser, 'Valeria Luna');
  await rosa.getByRole('button', { name: 'Aceptar encargo' }).click();
  await esperarAviso(rosa, 'Encargo aceptado');
  await contexto.close();

  await page.reload();
  await page.getByRole('link', { name: 'Pagar y subir comprobante' }).click();
  // Seña del 30 % de $ 28.000.
  await expect(page.getByRole('heading', { name: 'Pago de tu pedido' })).toBeVisible();
  await expect(page.getByText(/8\.400/).first()).toBeVisible();
  await page.locator('input[type=file]').setInputFiles('archivos/comprobante.png');
  await page.getByRole('button', { name: 'Enviar comprobante' }).click();
  await esperarAviso(page, 'Comprobante enviado. La tienda lo va a revisar.');
});

test('rechazar un encargo: el cliente lo ve cancelado', async ({ page, browser }) => {
  await encargarHasta(page, 'Rogel', 'Ramiro Rechazo');
  await page.getByRole('button', { name: 'Confirmar encargo' }).click();
  await expect(page.getByText(/acepte tu encargo/)).toBeVisible();

  const { rosa, contexto } = await rosaAbreElEncargo(browser, 'Ramiro Rechazo');
  await rosa.getByRole('button', { name: 'Rechazar encargo' }).click();
  await rosa
    .getByRole('dialog')
    .getByLabel(/Motivo/)
    .fill('Ese día no llegamos');
  await rosa
    .getByRole('dialog')
    .getByRole('button', { name: 'Rechazar encargo' })
    .click();
  await esperarAviso(rosa, 'Pedido cancelado');
  await contexto.close();

  await page.reload();
  await expect(page.getByText('Pedido cancelado')).toBeVisible();
});
