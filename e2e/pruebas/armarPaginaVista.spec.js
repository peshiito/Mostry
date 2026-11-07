import { expect, test } from '@playwright/test';
import { abrirEditor } from '../apoyo/editor.js';
import { API } from '../apoyo/forzar.js';
import { urlTienda } from '../apoyo/entorno.js';
import { SESION_ROSA } from '../apoyo/ingresar.js';

test.use({ storageState: SESION_ROSA });

// "Armá tu página" (P6): tocar un bloque en la vista previa y ver el borrador
// con el link del QR (sin el link, se ve lo de siempre).
test('tocar en la vista previa y mirar el borrador', async ({ page, browser }) => {
  await abrirEditor(page, 'dona-rosa');
  const pantalla = page.locator('[data-elegible]');
  const cierre = pantalla.locator('[data-bloque="cierre"]');
  await cierre.scrollIntoViewIfNeeded();
  const caja = await cierre.boundingBox();
  await page.mouse.click(caja.x + caja.width / 2, caja.y + caja.height / 2);
  await expect(page.getByRole('textbox', { name: 'Título' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Título' }).fill('Solo en el borrador');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Mirala en tu celu' }).click();
  const abrir = page.getByRole('link', { name: 'Abrir en esta compu' });
  const link = await abrir.getAttribute('href');
  expect(link).toMatch(/\?borrador=\d+\.[a-f0-9]{64}$/);

  const otro = await browser.newContext();
  const celu = await otro.newPage();
  await celu.goto(link);
  await expect(celu.getByText('Estás viendo tu borrador.')).toBeVisible();
  await expect(celu.getByText('Solo en el borrador')).toBeVisible();
  await celu.getByRole('button', { name: 'Salir' }).click();
  await expect(celu.getByText('Estás viendo tu borrador.')).toHaveCount(0);
  await expect(celu.getByText('Solo en el borrador')).toHaveCount(0);
  await celu.goto(urlTienda('dona-rosa', '/?borrador=1.alterado'));
  await expect(celu.getByText('Estás viendo tu borrador.')).toHaveCount(0);
  await otro.close();

  await page.evaluate(
    (api) =>
      fetch(`${api}/panel/tienda/pagina`, { method: 'DELETE', credentials: 'include' }),
    API,
  );
});
