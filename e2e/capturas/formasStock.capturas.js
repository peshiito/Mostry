import { expect, test } from '@playwright/test';
import { urlTienda } from '../apoyo/entorno.js';
import { SESION_ROSA } from '../apoyo/ingresar.js';
import { foto } from './foto.js';

// Capturas de las formas de stock (Mejoras 3, parte B), en modo claro.
test.describe('formas de stock', () => {
  test.use({ storageState: SESION_ROSA, colorScheme: 'light' });

  test('formulario, lista del panel y tienda', async ({ page }) => {
    await page.goto(urlTienda('dona-rosa', '/panel/productos/nuevo'));
    await expect(page.getByText('¿Cómo manejás el stock?')).toBeVisible();
    await page.getByText('Cuento unidades').scrollIntoViewIfNeeded();
    await foto(page, 'claro', 'stock-01-forma-unidades');
    await page.getByText('Solo marco si hay o no hay').click();
    await foto(page, 'claro', 'stock-02-forma-hay-no-hay');

    await page.goto(urlTienda('dona-rosa', '/panel/productos'));
    await expect(page.getByRole('button', { name: /Pan francés/ })).toBeVisible();
    await page.mouse.wheel(0, 2000);
    await foto(page, 'claro', 'stock-03-lista-panel');

    await page.goto(urlTienda('dona-rosa', '/catalogo'));
    await page.getByText('Rogel').first().scrollIntoViewIfNeeded();
    await foto(page, 'claro', 'stock-04-tienda');
  });
});
