import { expect, test } from '@playwright/test';
import { registrarPago } from '../apoyo/admin.js';
import { sql } from '../apoyo/base.js';
import { urlTienda } from '../apoyo/entorno.js';
import { ingresar, SESION_ADMIN } from '../apoyo/ingresar.js';
import { vencerPrueba } from '../apoyo/worker.js';

// Suscripción completa (CLAUDE.md 6.5): prueba → gracia → suspendida → reactivada.
// Para no esperar días, se corre la fecha de fin de la prueba y se ejecuta la
// tarea diaria del worker, igual que en producción.
const vencer = (dias) => vencerPrueba(sql, 'heladeria', dias);

test('de la prueba gratis a suspendida, y de vuelta a activa con el pago', async ({
  page,
  browser,
}) => {
  const panel = urlTienda('heladeria', '/panel');
  const vidriera = await (await browser.newContext()).newPage();
  await vencer(2);
  await ingresar(page, `${panel}/ingresar`, 'martin@heladeria.test');
  await expect(page.getByText(/Te quedan 2 días de prueba/)).toBeVisible();

  // Venció hace 1 día: gracia (la tienda sigue vendiendo).
  await vencer(-1);
  await page.reload();
  await expect(page.getByText(/Tu plan venció/)).toBeVisible();
  await vidriera.goto(urlTienda('heladeria', '/catalogo'));
  await expect(vidriera.getByText('1 kg').first()).toBeVisible();

  // Pasó la gracia: suspendida. Vidriera cerrada y panel en solo lectura.
  await vencer(-5);
  await page.goto(`${panel}/caja`);
  await expect(
    page.getByText('Tienda suspendida · el panel queda en solo lectura'),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Abrir caja' })).toBeDisabled();
  await vidriera.reload();
  await expect(vidriera.getByText('Cerrada temporalmente')).toBeVisible();

  // El admin registra el pago: vuelve a estar activa.
  const admin = await (
    await browser.newContext({ storageState: SESION_ADMIN })
  ).newPage();
  await registrarPago(admin, 'Heladería del Parque');

  await page.reload();
  await expect(page.getByText(/solo lectura|Tu plan venció|de prueba/)).toHaveCount(0);
  await vidriera.goto(urlTienda('heladeria', '/catalogo'));
  await expect(vidriera.getByText('1 kg').first()).toBeVisible();
});
