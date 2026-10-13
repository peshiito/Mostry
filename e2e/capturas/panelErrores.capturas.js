import { expect, test } from '@playwright/test';
import { urlTienda } from '../apoyo/entorno.js';
import { API, forzar } from '../apoyo/forzar.js';
import { SESION_ROSA } from '../apoyo/ingresar.js';
import { ESQUEMAS, foto } from './foto.js';

const CAJA = urlTienda('dona-rosa', '/panel/caja');
const ERRORES = [
  [500, 'error_interno', 'error-servidor'],
  [503, 'error', 'mantenimiento'],
  [403, 'sin_permiso', 'sin-permiso'],
  [429, 'demasiados_intentos', 'muchos-intentos'],
];

for (const [esquema, colorScheme] of ESQUEMAS) {
  test.describe(`panel errores ${esquema}`, () => {
    test.use({ colorScheme, storageState: SESION_ROSA });

    test('cada error de la API', async ({ page }) => {
      for (const [i, [status, codigo, nombre]] of ERRORES.entries()) {
        await forzar(page, '/panel/caja', status, codigo);
        await page.goto(CAJA);
        await expect(page.locator('[role=alert] h2')).toBeVisible();
        await foto(page, esquema, `panel-0${i + 1}-${nombre}`);
        await page.unrouteAll();
      }
      await page.route(`${API}/panel/caja`, (r) => r.abort('internetdisconnected'));
      await page.goto(CAJA);
      await expect(page.locator('[role=alert] h2')).toBeVisible();
      await foto(page, esquema, 'panel-05-sin-conexion');
    });

    test('pantalla rota, versión nueva, 404 y sesión vencida', async ({ page }) => {
      await page.route(`${API}/panel/pedidos/1`, (r) =>
        r.fulfill({ json: { items: 5 } }),
      );
      await page.goto(urlTienda('dona-rosa', '/panel/pedidos/1'));
      await expect(page.getByRole('heading', { name: /Algo se rompió/ })).toBeVisible();
      await foto(page, esquema, 'panel-06-algo-se-rompio');
      await page.unrouteAll();

      await page.route(/\/src\/features\/caja\//, (r) => r.abort());
      await page.goto(CAJA);
      await expect(page.getByRole('heading', { name: /versión nueva/ })).toBeVisible();
      await foto(page, esquema, 'panel-07-version-nueva');
      await page.unrouteAll();

      await page.goto(urlTienda('dona-rosa', '/panel/no-existe'));
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await foto(page, esquema, 'panel-08-404');

      await forzar(page, '/panel/caja', 401, 'sin_sesion');
      await page.goto(CAJA);
      await expect(page).toHaveURL(/ingresar$/);
      await page.waitForTimeout(300);
      await foto(page, esquema, 'panel-09-sesion-vencida');
    });
  });
}
