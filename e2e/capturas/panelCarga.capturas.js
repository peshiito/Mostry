import { expect, test } from '@playwright/test';
import { urlTienda } from '../apoyo/entorno.js';
import { API, redLenta } from '../apoyo/forzar.js';
import { SESION_ROSA } from '../apoyo/ingresar.js';
import { colgar, ESQUEMAS, foto } from './foto.js';

const panel = (ruta) => urlTienda('dona-rosa', `/panel${ruta}`);
// Primero que arranque el panel (pestañas abajo), después el esqueleto de la pantalla.
async function ocupado(page) {
  await expect(
    page.getByRole('navigation', { name: 'Secciones del panel' }),
  ).toBeVisible();
  await expect(page.locator('[aria-busy="true"]').first()).toBeVisible();
}

for (const [esquema, colorScheme] of ESQUEMAS) {
  test.describe(`panel carga ${esquema}`, () => {
    test.use({ colorScheme, storageState: SESION_ROSA });

    test('esqueletos y barra de progreso', async ({ page }) => {
      // Inicio: 4 de las 5 consultas responden, la del stock bajo no (barra al 80 %).
      const pedida = await colgar(page, `${API}/panel/productos?stockBajo=true`);
      await page.goto(panel(''));
      await pedida();
      await ocupado(page);
      await expect(page.getByRole('progressbar', { name: /Cargando/ })).toBeVisible();
      await foto(page, esquema, 'panel-10-inicio-cargando-barra');
      await page.unrouteAll();

      const pantallas = [
        ['/pedidos', `${API}/panel/pedidos*`, 'pedidos'],
        ['/pedidos/1', `${API}/panel/pedidos/1`, 'pedido-detalle'],
        ['/productos', `${API}/panel/productos*`, 'productos'],
        ['/horarios', `${API}/panel/horarios*`, 'horarios'],
      ];
      for (const [i, [ruta, patron, nombre]] of pantallas.entries()) {
        const pedida = await colgar(page, patron);
        await page.goto(panel(ruta));
        await pedida();
        await ocupado(page);
        await foto(page, esquema, `panel-1${i + 1}-esqueleto-${nombre}`);
        await page.unrouteAll();
      }
    });

    test('subida del logo y botón guardando', async ({ page }) => {
      await page.goto(panel('/tienda'));
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await redLenta(page, 8_000);
      await page
        .locator('input[type=file]')
        .first()
        .setInputFiles('archivos/producto.png');
      const barra = page.getByRole('progressbar', { name: 'Subiendo el archivo' });
      await expect(barra).toHaveAttribute('aria-valuenow', /^[3-7]\d$/, {
        timeout: 20_000,
      });
      await foto(page, esquema, 'panel-15-subiendo-logo');
      await expect(barra).toHaveCount(0, { timeout: 30_000 });

      const pedida = await colgar(page, `${API}/panel/tienda/config`);
      await page.getByLabel('Frase').fill('Facturas y tortas todos los días');
      await page.getByRole('button', { name: 'Guardar cambios' }).click();
      await pedida();
      await expect(page.getByRole('button', { name: 'Guardando…' })).toBeVisible();
      await foto(page, esquema, 'panel-16-boton-guardando');
    });
  });
}
