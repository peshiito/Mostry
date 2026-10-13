import { expect, test } from '@playwright/test';
import { urlTienda } from '../apoyo/entorno.js';
import { API, forzar } from '../apoyo/forzar.js';
import { colgar, ESQUEMAS, foto } from './foto.js';

const tienda = (ruta) => urlTienda('dona-rosa', ruta);
const TOKEN = 'A'.repeat(43);

for (const [esquema, colorScheme] of ESQUEMAS) {
  test.describe(`tienda ${esquema}`, () => {
    test.use({ colorScheme });

    test('404, catálogo cargando y errores', async ({ page }) => {
      await page.goto(tienda('/no-existe'));
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await foto(page, esquema, 'tienda-01-404');

      const pedida = await colgar(page, `${API}/publico/productos*`);
      await page.goto(tienda('/catalogo'));
      await pedida();
      await expect(page.locator('[aria-busy="true"]').first()).toBeVisible();
      await foto(page, esquema, 'tienda-02-catalogo-cargando');
      await page.unrouteAll();

      await forzar(page, '/publico/productos/*', 500, 'error_interno');
      await page.goto(tienda('/producto/1'));
      await expect(page.getByRole('heading', { name: /nuestro lado/ })).toBeVisible();
      await foto(page, esquema, 'tienda-03-producto-error-servidor');
      await page.unrouteAll();

      await page.goto(tienda(`/pedido/${TOKEN}`));
      await expect(page.getByRole('heading', { name: /No encontramos/ })).toBeVisible();
      await foto(page, esquema, 'tienda-04-seguimiento-inexistente');

      await page.route(`${API}/publico/productos*`, (r) =>
        r.abort('internetdisconnected'),
      );
      await page.goto(tienda('/catalogo'));
      await expect(page.getByRole('heading', { name: /Se cortó/ })).toBeVisible();
      await foto(page, esquema, 'tienda-05-sin-conexion');
    });
  });
}
