import { expect, test } from '@playwright/test';
import { esperarAviso } from '../apoyo/avisos.js';
import { URL_ADMIN, urlTienda } from '../apoyo/entorno.js';
import { demorar, redLenta } from '../apoyo/forzar.js';
import { SESION_ADMIN, SESION_ROSA } from '../apoyo/ingresar.js';

test.describe('panel', () => {
  test.use({ storageState: SESION_ROSA });

  test('una carga lenta muestra el esqueleto y la barra de arriba', async ({ page }) => {
    await page.goto(urlTienda('dona-rosa', '/panel'));
    await demorar(page, '/panel/pedidos*', 1500);
    await page.getByRole('link', { name: 'Pedidos' }).first().click();
    await expect(
      page.getByRole('progressbar', { name: 'Cargando la pantalla' }),
    ).toBeVisible();
    await expect(page.locator('[aria-busy="true"]').first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Pedidos' })).toBeVisible();
    await expect(
      page.getByRole('progressbar', { name: 'Cargando la pantalla' }),
    ).toHaveCount(0);
  });

  test('subir el logo muestra el progreso real de la subida', async ({ page }) => {
    await page.goto(urlTienda('dona-rosa', '/panel/tienda'));
    await redLenta(page);
    await page.locator('input[type=file]').first().setInputFiles('archivos/producto.png');
    const barra = page.getByRole('progressbar', { name: 'Subiendo el archivo' });
    await expect(barra).toBeVisible();
    await expect(barra).toHaveAttribute('aria-valuetext', /Subiendo… \d+ %/);
    await esperarAviso(page, 'Logo actualizado');
  });
});

test.describe('404 de cada zona', () => {
  test('tienda', async ({ page }) => {
    await page.goto(urlTienda('dona-rosa', '/no-existe'));
    await expect(
      page.getByRole('heading', { name: 'Esta página no está en la tienda' }),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: 'Ver la tienda' })).toBeVisible();
  });

  test('panel', async ({ browser }) => {
    const page = await browser.newPage({ storageState: SESION_ROSA });
    await page.goto(urlTienda('dona-rosa', '/panel/no-existe'));
    await expect(
      page.getByRole('heading', { name: 'Esta parte del panel no existe' }),
    ).toBeVisible();
    await page.close();
  });

  test('admin', async ({ browser }) => {
    const page = await browser.newPage({ storageState: SESION_ADMIN });
    await page.goto(`${URL_ADMIN}/no-existe`);
    await expect(page.getByRole('link', { name: 'Volver a las tiendas' })).toBeVisible();
    await page.close();
  });
});
