import { expect, test } from '@playwright/test';
import { urlTienda } from '../apoyo/entorno.js';
import { SESION_ROSA } from '../apoyo/ingresar.js';

// Videos de las animaciones (Mejoras 2), con el movimiento activado.
// Quedan en test-results/; el script de capturas los copia a ~/.cache.
const video = { mode: 'on', size: { width: 390, height: 844 } };
const pausa = (page, ms = 700) => page.waitForTimeout(ms);

test.use({ reducedMotion: 'no-preference', video });

test.describe('panel', () => {
  test.use({ storageState: SESION_ROSA });

  test('pestañas, listas, chips, montos y tema', async ({ page }) => {
    const nav = page.getByRole('navigation', { name: 'Secciones del panel' });
    await page.goto(urlTienda('dona-rosa', '/panel'));
    await pausa(page, 1500);
    for (const p of ['Pedidos', 'Caja', 'Productos', 'Más', 'Pedidos', 'Inicio']) {
      await nav.getByRole('link', { name: new RegExp(p) }).click();
      await pausa(page, 900);
    }
    await nav.getByRole('link', { name: /Productos/ }).click();
    await pausa(page);
    for (const c of ['Facturas', 'Tortas', 'Todos']) {
      await page.getByRole('button', { name: c, exact: true }).first().click();
      await pausa(page);
    }
    await page
      .getByRole('button', { name: /^Modo / })
      .first()
      .click();
    await pausa(page, 1000);
    await page
      .getByRole('button', { name: /^Modo / })
      .first()
      .click();
    await pausa(page, 1200);
  });
});

test.describe('tienda', () => {
  test('catálogo, agregar, cantidad, carrito y seguimiento', async ({ page }) => {
    await page.goto(urlTienda('dona-rosa', '/'));
    await pausa(page, 1500);
    await page.goto(urlTienda('dona-rosa', '/catalogo'));
    await pausa(page);
    await page.getByRole('button', { name: 'Tortas', exact: true }).click();
    await pausa(page);
    await page.getByRole('button', { name: 'Todo', exact: true }).click();
    await pausa(page);
    await page.getByText('Medialuna de manteca').first().click();
    await pausa(page);
    await page.getByRole('button', { name: 'Agregar' }).click();
    await expect(page.getByRole('heading', { name: 'Tu pedido' })).toBeVisible();
    await pausa(page);
    for (let i = 0; i < 3; i += 1) {
      await page.getByRole('button', { name: 'Sumar uno' }).first().click();
      await pausa(page, 500);
    }
    await page.getByRole('button', { name: 'Restar uno' }).first().click();
    await pausa(page, 1200);
  });
});
