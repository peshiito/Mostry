import { expect, test } from '@playwright/test';
import { esperarAviso } from '../apoyo/avisos.js';
import { urlTienda } from '../apoyo/entorno.js';
import { SESION_ROSA } from '../apoyo/ingresar.js';

test.use({ storageState: SESION_ROSA });

// Venta rápida en el local (Mejoras 3, parte C): tocar productos, cobrar y verlo.
test('vender en el local con productos: suma, cobra y queda en lo vendido hoy', async ({
  page,
}) => {
  await page.goto(urlTienda('dona-rosa', '/panel/vender'));
  const medialuna = page.getByRole('button', { name: /^Medialuna de manteca/ });
  await medialuna.click();
  await medialuna.click();
  await expect(
    page.getByRole('button', { name: /Medialuna de manteca, 2 en la venta/ }),
  ).toBeVisible();
  await page.getByRole('radio', { name: 'Transferencia' }).click();
  await page.getByRole('button', { name: /^Cobrar \$ / }).click();
  await esperarAviso(page, /Venta #\d+ cobrada/);
  await expect(page.getByText(/Vendido hoy en el local/)).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Tocá un producto para empezar' }),
  ).toBeDisabled();
});
