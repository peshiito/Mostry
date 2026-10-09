import { expect, test } from '@playwright/test';
import { registrarPago } from '../apoyo/admin.js';
import { esperarAviso } from '../apoyo/avisos.js';
import { URL_ADMIN, urlTienda } from '../apoyo/entorno.js';
import { SESION_ADMIN } from '../apoyo/ingresar.js';

test.use({ storageState: SESION_ADMIN });
const abrirTienda = async (page, nombre) => {
  await page.goto(URL_ADMIN);
  await page.getByRole('link', { name: nombre }).first().click();
};

// Admin de Mostry (CLAUDE.md 3.4): registra el pago de una tienda en prueba.
test('registrar un pago extiende el plan y deja la tienda activa', async ({ page }) => {
  await registrarPago(page, 'Heladería del Parque');
  await expect(page.getByText(/Activa/).first()).toBeVisible();
});

// Suspender bloquea la tienda pública (sin borrar nada) y reactivar la devuelve.
test('suspender y reactivar una tienda', async ({ page }) => {
  await abrirTienda(page, 'Facturería Doña Rosa');
  await page.getByRole('button', { name: 'Suspender' }).click();
  await page
    .getByRole('dialog')
    .getByLabel('Motivo (obligatorio)')
    .fill('Prueba de suspensión');
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Suspender tienda' })
    .click();
  await esperarAviso(page, 'Tienda suspendida');

  const vidriera = await page.context().newPage();
  await vidriera.goto(urlTienda('dona-rosa'));
  await expect(vidriera.getByText('Cerrada temporalmente')).toBeVisible();

  await page.getByRole('button', { name: 'Reactivar' }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Reactivar tienda' })
    .click();
  await esperarAviso(page, 'Tienda reactivada');
  await vidriera.reload();
  await expect(vidriera.getByText('Medialuna de manteca').first()).toBeVisible();
});
