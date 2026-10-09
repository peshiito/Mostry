import { expect, test } from '@playwright/test';
import { PUERTO_PWA } from '../apoyo/entorno.js';

// Panel instalable y sin conexión (Etapa 14), contra el build con su CSP real.
const pwa = (ruta) => `http://dona-rosa.mostry.localhost:${PUERTO_PWA}${ruta}`;
const registros = (page) =>
  page.evaluate(async () => (await navigator.serviceWorker.getRegistrations()).length);

test('el manifest tiene lo necesario para instalar el panel', async ({ request }) => {
  const res = await request.get(pwa('/manifest.webmanifest'));
  expect(res.ok()).toBe(true);
  const m = await res.json();
  expect(m).toMatchObject({ start_url: '/panel', display: 'standalone' });
  expect(m.icons.map((i) => i.purpose ?? 'any')).toContain('maskable');
  for (const icono of m.icons) {
    const img = await request.get(pwa(icono.src));
    expect(img.headers()['content-type']).toBe('image/png');
  }
});

test('la vidriera del comprador no instala nada', async ({ page }) => {
  await page.goto(pwa('/catalogo'));
  await expect(page.locator('#contenido')).toBeAttached();
  expect(await registros(page)).toBe(0);
  await expect(page.locator('link[rel=manifest]')).toHaveCount(0);
});

test('sin conexión el panel abre igual, avisa y no inventa datos', async ({
  page,
  context,
}) => {
  const errores = [];
  page.on('console', (m) => m.type() === 'error' && errores.push(m.text()));
  await page.goto(pwa('/panel/ingresar'));
  await page.evaluate(() => navigator.serviceWorker.ready);
  expect(await registros(page)).toBe(1);
  await expect(page.locator('link[rel=manifest]')).toHaveCount(1);

  await context.setOffline(true);
  await page.reload();
  await expect(page.getByText('Sin conexión · revisá tu internet')).toBeVisible();
  await page.getByLabel('Email').fill('rosa@donarosa.test');
  await page.getByLabel(/^Contraseña/).fill('una-clave-cualquiera');
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await expect(
    page.getByText('No pudimos conectarnos. Revisá tu internet.').first(),
  ).toBeVisible();

  await context.setOffline(false);
  await expect(page.getByText('Sin conexión · revisá tu internet')).toHaveCount(0);
  // Ningún bloqueo de la CSP (service worker, script del tema, íconos).
  expect(errores.filter((e) => /Content Security Policy/.test(e))).toEqual([]);
});
