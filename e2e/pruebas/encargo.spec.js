import { expect, test } from '@playwright/test';
import { esperarAviso } from '../apoyo/avisos.js';
import { urlTienda } from '../apoyo/entorno.js';
import { diaDentroDe } from '../apoyo/fechas.js';

// Encargo con seña (CLAUDE.md 6.2): torta para otro día, se paga solo el 30 %.
test('encargo de torta con seña: día, hora y pago de la seña', async ({ page }) => {
  await page.goto(urlTienda('dona-rosa', '/catalogo'));
  await page.getByText('Rogel').first().click();
  await page.getByRole('button', { name: 'Agregar' }).click();
  await esperarAviso(page, 'Agregaste 1 × Rogel');
  await page.getByRole('link', { name: /Continuar/ }).click();

  await page.getByLabel('Nombre y apellido').fill('Valeria Luna');
  await page.getByLabel('WhatsApp').fill('11 3344-5566');
  await page.getByRole('button', { name: 'Elegir día y hora' }).click();

  await expect(
    page.getByRole('heading', { name: '¿Para cuándo lo querés?' }),
  ).toBeVisible();
  const dia = diaDentroDe(3);
  if (dia.otroMes) await page.getByRole('button', { name: 'Mes siguiente' }).click();
  await page.getByRole('button', { name: dia.etiqueta }).click();
  await page
    .getByRole('group', { name: 'Horario de retiro o entrega' })
    .getByRole('button')
    .first()
    .click();
  await page.getByRole('button', { name: 'Confirmar encargo' }).click();

  // Seña del 30 % de $ 28.000.
  await expect(page.getByRole('heading', { name: 'Pago de tu pedido' })).toBeVisible();
  await expect(page.getByText(/8\.400/).first()).toBeVisible();
  await page.locator('input[type=file]').setInputFiles('archivos/comprobante.png');
  await page.getByRole('button', { name: 'Enviar comprobante' }).click();
  await esperarAviso(page, 'Comprobante enviado. La tienda lo va a revisar.');
});
