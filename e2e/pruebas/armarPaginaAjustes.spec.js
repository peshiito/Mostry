import { expect, test } from '@playwright/test';
import { abrirEditor } from '../apoyo/editor.js';
import { esperarAviso } from '../apoyo/avisos.js';
import { API } from '../apoyo/forzar.js';
import { urlTienda } from '../apoyo/entorno.js';
import { SESION_ROSA } from '../apoyo/ingresar.js';

test.use({ storageState: SESION_ROSA });

// "Armá tu página" (P4): vender por WhatsApp y el Producto destacado.
test('sin carrito: se consulta por WhatsApp y el carrito vuelve al inicio', async ({
  page,
}) => {
  await abrirEditor(page, 'dona-rosa');
  await page.getByRole('button', { name: 'Agregar bloque' }).click();
  await page.getByRole('button', { name: /^Producto destacado/ }).click();
  await page.getByRole('button', { name: 'Ajustes' }).click();
  await page.getByRole('radio', { name: 'Te consultan por WhatsApp' }).click();
  await page.keyboard.press('Escape');
  await expect(page.getByText('Cambios guardados')).toBeVisible({ timeout: 10000 });
  await page.getByRole('button', { name: 'Publicar' }).click();
  await esperarAviso(page, 'Listo, tu página ya está publicada');

  await page.goto(urlTienda('dona-rosa', '/'));
  await expect(page.getByText('Destacado', { exact: true })).toBeVisible();
  const consultar = page.getByRole('link', { name: /^Consultar por .+ por WhatsApp$/ });
  await expect(consultar.first()).toBeVisible();
  await expect(consultar.first()).toHaveAttribute(
    'href',
    /^https:\/\/wa\.me\/\d+\?text=/,
  );
  await expect(page.getByRole('link', { name: /Ver carrito/ })).toHaveCount(0);
  await page.goto(urlTienda('dona-rosa', '/carrito'));
  await expect(page).toHaveURL(/\/$/);

  await page.evaluate(
    (api) =>
      fetch(`${api}/panel/tienda/pagina`, { method: 'DELETE', credentials: 'include' }),
    API,
  );
});
