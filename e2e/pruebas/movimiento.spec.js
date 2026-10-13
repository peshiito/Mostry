import { expect, test } from '@playwright/test';
import { urlTienda } from '../apoyo/entorno.js';
import { SESION_ROSA } from '../apoyo/ingresar.js';

// Con el movimiento activado (el resto de la suite corre con "reducir movimiento").
test.use({ storageState: SESION_ROSA, reducedMotion: 'no-preference' });

test('la pestaña activa se eleva y su fondo se desliza a la nueva', async ({ page }) => {
  await page.goto(urlTienda('dona-rosa', '/panel'));
  const nav = page.getByRole('navigation', { name: 'Secciones del panel' });
  await nav.getByRole('link', { name: /Productos/ }).click();
  await expect(page).toHaveURL(/\/panel\/productos$/);
  const activa = nav.locator('a[aria-current=page]');
  const icono = activa.locator('> span').first();
  await expect
    .poll(() => icono.evaluate((e) => getComputedStyle(e).transform))
    .toBe('matrix(1.08, 0, 0, 1.08, 0, -3)');
  // La pastilla vive solo en la pestaña activa.
  await expect(activa.locator('span[aria-hidden=true]')).toHaveCount(1);
  await expect(nav.locator('a:not([aria-current]) span[aria-hidden=true]')).toHaveCount(
    0,
  );
});

test('cambiar el tema con la transición deja el tema elegido', async ({ page }) => {
  await page.goto(urlTienda('dona-rosa', '/'));
  const boton = page.getByRole('button', { name: /^Modo / }).first();
  await boton.click(); // automático → claro
  await boton.click(); // claro → oscuro
  await expect(page.locator('html')).toHaveAttribute('data-tema', 'oscuro');
});
