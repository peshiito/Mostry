import { expect, test } from '@playwright/test';
import { esperarAviso } from '../apoyo/avisos.js';
import { CLAVE, URL_ADMIN, urlTienda } from '../apoyo/entorno.js';
import { SESION_ADMIN } from '../apoyo/ingresar.js';
import { tiendaNueva } from '../apoyo/tiendaNueva.js';

test.use({ storageState: SESION_ADMIN });

// Mejoras 4: el admin ayuda con la cuenta y elimina tiendas que no pagan.
async function abrir(page, t) {
  await page.goto(URL_ADMIN);
  await page.getByPlaceholder('Buscar por nombre, link o email').fill(t.slug);
  await page.getByRole('link', { name: t.nombreNegocio }).click();
  await expect(page.getByRole('heading', { name: 'Ayudar con la cuenta' })).toBeVisible();
}

test('clave temporal: el dueño entra con ella y elige una nueva', async ({
  page,
  browser,
}) => {
  const t = await tiendaNueva('clave');
  await abrir(page, t);
  await page.getByRole('button', { name: 'Problemas con la contraseña' }).click();
  await page.getByRole('button', { name: 'Generar clave temporal' }).click();
  const clave = await page.getByText(/^[a-zA-Z2-9]{10}$/).textContent();

  const dueno = await browser.newPage({ storageState: { cookies: [], origins: [] } });
  await dueno.goto(urlTienda(t.slug, '/panel/ingresar'));
  await dueno.getByLabel('Email').fill(t.email);
  await dueno.getByLabel(/^Contraseña/).fill(clave);
  await dueno.getByRole('button', { name: 'Ingresar' }).click();
  await expect(dueno.getByRole('heading', { name: 'Elegí tu contraseña' })).toBeVisible();
  await dueno.getByLabel('Clave temporal').fill(clave);
  await dueno.getByLabel(/^Contraseña nueva/).fill('mi-clave-nueva-2026');
  await dueno.getByRole('button', { name: 'Guardar y entrar' }).click();
  // Tienda recién creada: después de elegir la clave, siguen las preguntas del inicio.
  await expect(
    dueno.getByRole('heading', { name: '¿Qué querés hacer con Mostry?' }),
  ).toBeVisible();
  await dueno.close();
});

test('suspender y eliminar libera el email y el link', async ({ page }) => {
  const t = await tiendaNueva('borrar');
  await abrir(page, t);
  await page.getByRole('button', { name: 'Suspender' }).click();
  await page.getByRole('dialog').getByLabel('Motivo (obligatorio)').fill('No pagó');
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Suspender tienda' })
    .click();
  await esperarAviso(page, 'Tienda suspendida');

  await page.getByRole('button', { name: 'Eliminar tienda' }).click();
  const hoja = page.getByRole('dialog', { name: 'Eliminar tienda' });
  await hoja.getByLabel(/Escribí el link/).fill(t.slug);
  await hoja.getByLabel(/Tu contraseña de admin/).fill(CLAVE);
  await hoja.getByRole('button', { name: 'Eliminar para siempre' }).click();
  await esperarAviso(page, 'Tienda eliminada');
  await expect(page).toHaveURL(`${URL_ADMIN}/`);
  await expect(page.getByRole('link', { name: t.nombreNegocio })).toHaveCount(0);
});
