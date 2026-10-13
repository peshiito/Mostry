import { expect, test } from '@playwright/test';
import { esperarAviso } from '../apoyo/avisos.js';
import { CLAVE, urlTienda } from '../apoyo/entorno.js';
import { API, forzar } from '../apoyo/forzar.js';
import { SESION_ROSA } from '../apoyo/ingresar.js';

test.use({ storageState: SESION_ROSA });

const CAJA = urlTienda('dona-rosa', '/panel/caja');

// Cada error de la API tiene su mensaje: un 500 no es "revisá tu conexión".
const CASOS = [
  [500, 'error_interno', 'Algo falló de nuestro lado', true],
  [503, 'error', 'Estamos haciendo mejoras', true],
  [403, 'sin_permiso', 'No tenés acceso a esta parte', false],
  [429, 'demasiados_intentos', 'Hiciste muchos intentos', true],
];

for (const [status, codigo, titulo, reintenta] of CASOS) {
  test(`un ${status} muestra "${titulo}"`, async ({ page }) => {
    await forzar(page, '/panel/caja', status, codigo);
    await page.goto(CAJA);
    await expect(page.getByRole('heading', { name: titulo })).toBeVisible();
    const reintentar = page.getByRole('button', { name: 'Reintentar' });
    if (!reintenta) return expect(reintentar).toHaveCount(0);
    await page.unrouteAll();
    await reintentar.click();
    await expect(page.getByRole('heading', { name: 'Caja', exact: true })).toBeVisible();
  });
}

test('sin internet: "Se cortó la conexión"', async ({ page }) => {
  await page.route(`${API}/panel/caja`, (r) => r.abort('internetdisconnected'));
  await page.goto(CAJA);
  await expect(page.getByRole('heading', { name: 'Se cortó la conexión' })).toBeVisible();
});

test('si la sesión vence, pide ingresar y vuelve a la misma pantalla', async ({
  page,
}) => {
  await forzar(page, '/panel/caja', 401, 'sin_sesion');
  await page.goto(CAJA);
  await esperarAviso(page, 'Tu sesión venció');
  await expect(page).toHaveURL(/\/panel\/ingresar$/);
  await page.unrouteAll();
  await page.getByLabel('Email').fill('rosa@dona-rosa.test');
  await page.getByLabel(/^Contraseña/).fill(CLAVE);
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await expect(page).toHaveURL(CAJA);
  await expect(page.getByRole('heading', { name: 'Caja', exact: true })).toBeVisible();
});

test('si no se puede bajar una pantalla, recarga una vez y avisa la versión nueva', async ({
  page,
}) => {
  await page.route(/\/src\/features\/caja\//, (r) => r.abort());
  await page.goto(CAJA);
  await expect(
    page.getByRole('heading', { name: 'Hay una versión nueva de Mostry' }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Recargar' })).toBeVisible();
});
