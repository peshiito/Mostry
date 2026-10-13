import { expect, test } from '@playwright/test';
import { URL_ADMIN } from '../apoyo/entorno.js';
import { API } from '../apoyo/forzar.js';
import { SESION_ADMIN } from '../apoyo/ingresar.js';
import { colgar, ESQUEMAS, foto } from './foto.js';

const ocupado = (page) =>
  expect(page.locator('[aria-busy="true"]').first()).toBeVisible();

for (const [esquema, colorScheme] of ESQUEMAS) {
  test.describe(`admin ${esquema}`, () => {
    test.use({ colorScheme, storageState: SESION_ADMIN });

    test('esqueletos, 404 y error', async ({ page }) => {
      const pedida1 = await colgar(page, `${API}/admin/tiendas?*`);
      await page.goto(URL_ADMIN);
      await pedida1();
      await ocupado(page);
      await foto(page, esquema, 'admin-01-tiendas-cargando');
      await page.unrouteAll();

      const pedida2 = await colgar(page, `${API}/admin/metricas`);
      await page.goto(`${URL_ADMIN}/metricas`);
      await pedida2();
      await ocupado(page);
      await foto(page, esquema, 'admin-02-metricas-cargando');
      await page.unrouteAll();

      await page.route(`${API}/admin/tiendas/*`, (r) =>
        r.fulfill({ status: 500, json: { error: { codigo: 'error_interno' } } }),
      );
      await page.goto(`${URL_ADMIN}/tiendas/1`);
      await expect(page.locator('[role=alert] h2')).toBeVisible();
      await foto(page, esquema, 'admin-03-detalle-error-servidor');
      await page.unrouteAll();

      await page.goto(`${URL_ADMIN}/no-existe`);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await foto(page, esquema, 'admin-04-404');
    });
  });
}
