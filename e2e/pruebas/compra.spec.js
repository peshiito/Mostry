import { expect, test } from '@playwright/test';
import { esperarAviso } from '../apoyo/avisos.js';
import { urlTienda } from '../apoyo/entorno.js';

// Comprador sin cuenta: elige, pide, ve a dónde transferir, sube el comprobante
// y sigue el pedido con su link (CLAUDE.md 3.2 y 6.1).
test('compra inmediata con retiro: del catálogo al seguimiento', async ({ page }) => {
  await page.goto(urlTienda('dona-rosa', '/catalogo'));
  await page.getByText('Medialuna de manteca').first().click();
  await page.getByRole('button', { name: 'Agregar' }).click();
  await esperarAviso(page, 'Agregaste 1 × Medialuna de manteca');

  // Al agregar, la tienda lleva al carrito.
  await expect(page.getByRole('heading', { name: 'Tu pedido' })).toBeVisible();
  await page.getByRole('link', { name: /Continuar/ }).click();
  await page.getByLabel('Nombre y apellido').fill('Carolina Vega');
  await page.getByLabel('WhatsApp').fill('11 2345-6789');
  await page.getByText('Retiro en el local').click();
  await page.getByRole('button', { name: 'Confirmar pedido' }).click();

  await expect(page.getByRole('heading', { name: 'Pago de tu pedido' })).toBeVisible();
  await expect(page.getByText('dona.rosa.facturas')).toBeVisible();
  await page.locator('input[type=file]').setInputFiles('archivos/comprobante.png');
  await page.getByRole('button', { name: 'Enviar comprobante' }).click();
  await esperarAviso(page, 'Comprobante enviado. La tienda lo va a revisar.');
  await expect(page.getByText('Comprobante enviado').first()).toBeVisible();
});
