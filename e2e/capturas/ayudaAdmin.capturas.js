import { expect, test } from '@playwright/test';
import { URL_ADMIN } from '../apoyo/entorno.js';
import { SESION_ADMIN } from '../apoyo/ingresar.js';
import { tiendaNueva } from '../apoyo/tiendaNueva.js';
import { foto } from './foto.js';

// Capturas de la ayuda del admin (Mejoras 4), en escritorio.
test.use({
  storageState: SESION_ADMIN,
  colorScheme: 'light',
  viewport: { width: 1280, height: 860 },
});

test('tarjeta, clave temporal y eliminar', async ({ page }) => {
  const t = await tiendaNueva('captura');
  await page.goto(URL_ADMIN);
  await page.getByPlaceholder('Buscar por nombre, link o email').fill(t.slug);
  await page.getByRole('link', { name: t.nombreNegocio }).click();
  await page
    .getByRole('heading', { name: 'Ayudar con la cuenta' })
    .scrollIntoViewIfNeeded();
  await foto(page, 'claro', 'admin-ayuda-01-tarjeta');

  await page.getByRole('button', { name: 'Corregir datos de la tienda' }).click();
  await page.getByRole('dialog').getByLabel('Link').fill(`${t.slug}-bien`);
  await foto(page, 'claro', 'admin-ayuda-02-datos');
  await page.keyboard.press('Escape');

  await page.getByRole('button', { name: 'Problemas con la contraseña' }).click();
  await page.getByRole('button', { name: 'Generar clave temporal' }).click();
  await expect(page.getByText('Clave temporal lista')).toBeVisible();
  await foto(page, 'claro', 'admin-ayuda-03-clave');
  await page.keyboard.press('Escape');

  await page.getByRole('button', { name: 'Suspender' }).click();
  await page.getByRole('dialog').getByLabel('Motivo (obligatorio)').fill('No pagó');
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Suspender tienda' })
    .click();
  await page.getByRole('button', { name: 'Eliminar tienda' }).click();
  await page
    .getByRole('dialog', { name: 'Eliminar tienda' })
    .getByLabel(/Escribí el link/)
    .fill(t.slug);
  await foto(page, 'claro', 'admin-ayuda-04-eliminar');
});
