import { expect, test } from '@playwright/test';
import { esperarAviso } from '../apoyo/avisos.js';
import { API } from '../apoyo/forzar.js';
import { urlTienda } from '../apoyo/entorno.js';
import { SESION_ROSA } from '../apoyo/ingresar.js';

test.use({ storageState: SESION_ROSA });

// "Armá tu página" (P3): subir una imagen propia, ponerla en la portada y publicar.
test('una imagen propia en la portada llega a la vidriera', async ({ page }) => {
  await page.goto(urlTienda('dona-rosa', '/panel/pagina'));
  await page.getByRole('button', { name: /^Portada/ }).click();
  await page.getByLabel('Imagen', { exact: true }).selectOption('propia');
  await page.getByRole('button', { name: 'Elegir imágenes' }).click();
  await page
    .getByRole('dialog', { name: 'Tus imágenes' })
    .locator('input[type=file]')
    .setInputFiles('archivos/producto.png');
  await esperarAviso(page, 'Imagen agregada');
  await page
    .getByRole('dialog', { name: 'Tus imágenes' })
    .getByRole('button', { name: /^Foto/ })
    .first()
    .click();
  await page.keyboard.press('Escape'); // cierra "Tus imágenes"
  await expect(page.getByRole('dialog', { name: 'Tus imágenes' })).toBeHidden();
  await page.keyboard.press('Escape'); // cierra la hoja de la portada
  await expect(page.getByText('Cambios guardados')).toBeVisible({ timeout: 10000 });
  await page.getByRole('button', { name: 'Publicar' }).click();
  await esperarAviso(page, 'Listo, tu página ya está publicada');

  await page.goto(urlTienda('dona-rosa', '/'));
  const imagen = page.locator('[data-v="portada"] img').first();
  await expect(imagen).toHaveAttribute('src', /\/medios\/[\w-]+-1600\.webp$/);

  // Deja la página de siempre y borra la imagen de prueba.
  await page.evaluate(async (api) => {
    await fetch(`${api}/panel/tienda/pagina`, {
      method: 'DELETE',
      credentials: 'include',
    });
    const lista = await (
      await fetch(`${api}/panel/tienda/medios`, { credentials: 'include' })
    ).json();
    for (const m of lista)
      await fetch(`${api}/panel/tienda/medios/${m.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
  }, API);
});
