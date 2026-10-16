import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { API } from '../apoyo/forzar.js';
import { URL_SITIO, urlTienda } from '../apoyo/entorno.js';
import { SESION_ROSA } from '../apoyo/ingresar.js';

// S2: términos y privacidad, y la aceptación de una versión nueva.
const version = (archivo) =>
  readFileSync(new URL(archivo, import.meta.url), 'utf8').match(
    /VERSION_LEGAL = '([\d-]+)'/,
  )[1];

test('el frontend y el backend usan la misma versión de los términos', () => {
  expect(version('../../frontend/src/shared/lib/legal.js')).toBe(
    version('../../backend/src/config/legal.ts'),
  );
});

test('términos y privacidad en el sitio; /legal sigue andando', async ({ page }) => {
  await page.goto(`${URL_SITIO}/terminos`);
  await expect(
    page.getByRole('heading', { name: 'Términos y condiciones' }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Política de privacidad' }).last().click();
  await expect(
    page.getByRole('heading', { name: 'Política de privacidad' }),
  ).toBeVisible();
  await expect(page.getByText('Cookies y almacenamiento').first()).toBeVisible();
  await page.goto(`${URL_SITIO}/legal?privacidad`);
  await expect(page).toHaveURL(/\/privacidad$/);
});

test.describe('con la sesión de Rosa', () => {
  test.use({ storageState: SESION_ROSA });

  test('si cambiaron los términos, el panel los pide una vez y sigue', async ({
    page,
  }) => {
    // Simula una cuenta de antes de la versión vigente, hasta que acepte.
    let acepto = false;
    page.on('request', (req) => {
      if (req.method() === 'POST' && req.url().endsWith('/auth/terminos')) acepto = true;
    });
    await page.route(`${API}/auth/yo`, async (r) => {
      const res = await r.fetch();
      const cuerpo = await res.json();
      cuerpo.usuario.terminosPendientes = !acepto;
      await r.fulfill({ response: res, json: cuerpo });
    });
    await page.goto(urlTienda('dona-rosa', '/panel'));
    await expect(
      page.getByRole('heading', { name: 'Actualizamos los términos' }),
    ).toBeVisible();
    await page.getByRole('button', { name: 'Leí y acepto' }).click();
    await expect(
      page.getByRole('heading', { name: 'Actualizamos los términos' }),
    ).toBeHidden();
    await expect(page.getByRole('navigation').first()).toBeVisible();
    await page.unrouteAll({ behavior: 'ignoreErrors' });
  });
});
