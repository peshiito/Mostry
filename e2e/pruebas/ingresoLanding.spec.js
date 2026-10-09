import { expect, test } from '@playwright/test';
import { CLAVE, URL_SITIO } from '../apoyo/entorno.js';

// Ingresar desde la landing: el admin cae en su dashboard y cada comerciante
// en el panel de su tienda (Etapa 14.5, parte B).
async function entrarDesdeLanding(page, email) {
  await page.goto(URL_SITIO);
  await page.getByRole('link', { name: 'Ingresar' }).first().click();
  await expect(page.getByRole('heading', { name: 'Ingresá a Mostry' })).toBeVisible();
  await page.getByLabel('Email').fill(email);
  await page.getByLabel(/^Contraseña/).fill(CLAVE);
  // Lleva a otra zona (otro subdominio): el aviso no llega a verse, se mira la URL.
  await page.getByRole('button', { name: 'Ingresar' }).click();
}

test('el admin entra desde la landing y ve su dashboard', async ({ page }) => {
  await entrarDesdeLanding(page, 'admin@mostry.test');
  await expect(page).toHaveURL(/\/\/admin\./);
  await expect(page.getByRole('heading', { name: 'Tiendas', level: 1 })).toBeVisible();
});

test('la comerciante entra desde la landing y cae en su panel', async ({ page }) => {
  await entrarDesdeLanding(page, 'rosa@dona-rosa.test');
  await expect(page).toHaveURL(/\/\/dona-rosa\..+\/panel$/);
  await expect(page.getByRole('navigation').first()).toBeVisible();
});

test('con una clave mala no entra y no da pistas', async ({ page }) => {
  await page.goto(`${URL_SITIO}/ingresar`);
  await page.getByLabel('Email').fill('rosa@dona-rosa.test');
  await page.getByLabel(/^Contraseña/).fill('una-clave-que-no-es');
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await expect(page.getByRole('alert').first()).toBeVisible();
  await expect(page).toHaveURL(/\/ingresar$/);
});
