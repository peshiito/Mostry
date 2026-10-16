import { expect, test } from '@playwright/test';
import { esperarAviso } from '../apoyo/avisos.js';
import { PUERTO_PWA } from '../apoyo/entorno.js';
import { SESION_ROSA } from '../apoyo/ingresar.js';

// Avisos 1: la pantalla de avisos contra el build (con su service worker y su
// CSP real). El envío a Google/Apple no se prueba acá: lo cubre el backend.
test.use({ storageState: SESION_ROSA });
const pwa = (ruta) => `http://dona-rosa.mostry.localhost:${PUERTO_PWA}${ruta}`;

test('la pantalla de avisos muestra el estado y guarda el horario de silencio', async ({
  page,
}) => {
  await page.goto(pwa('/panel/avisos'));
  await expect(
    page.getByRole('heading', { name: 'Avisos en el teléfono' }),
  ).toBeVisible();
  await expect(page.getByText('Los avisos están apagados acá')).toBeVisible();
  await page.getByText('Horario de silencio').click();
  await page.getByRole('button', { name: 'Guardar horario' }).click();
  await esperarAviso(page, 'Horario de silencio guardado');
  await page.reload();
  await expect(page.getByRole('button', { name: 'Guardar horario' })).toHaveCount(0);
});

test('con los avisos bloqueados explica cómo destrabarlos', async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(Notification, 'permission', { get: () => 'denied' }),
  );
  await page.goto(pwa('/panel/avisos'));
  await expect(
    page.getByText('Los avisos están bloqueados en este navegador'),
  ).toBeVisible();
});

test('el inicio invita a activarlos, y si se cierra no vuelve', async ({ page }) => {
  // El Chromium de las pruebas arranca con las notificaciones denegadas.
  await page.addInitScript(() =>
    Object.defineProperty(Notification, 'permission', { get: () => 'default' }),
  );
  await page.goto(pwa('/panel'));
  const tarjeta = page.getByText('Enterate de cada pedido al toque');
  await expect(tarjeta).toBeVisible();
  await page.getByRole('button', { name: 'No mostrar más' }).click();
  await page.reload();
  await expect(page.getByText(/Hola,/)).toBeVisible();
  await expect(tarjeta).toHaveCount(0);
});
