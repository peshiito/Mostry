import { expect, test } from '@playwright/test';
import { esperarAviso } from '../apoyo/avisos.js';
import { API } from '../apoyo/forzar.js';
import { urlTienda } from '../apoyo/entorno.js';
import { SESION_ROSA } from '../apoyo/ingresar.js';

test.use({ storageState: SESION_ROSA });

// Deja la página de siempre, para no cambiarle el inicio a los otros recorridos.
const volverALaDeSiempre = (page) =>
  page.evaluate(
    (api) => fetch(`${api}/panel/tienda/pagina`, { method: 'DELETE', credentials: 'include' }),
    API,
  );

// "Armá tu página" (P2): sumar un bloque, escribirlo, publicarlo y verlo en la tienda.
test('agregar un texto, publicarlo y verlo en la vidriera', async ({ page }) => {
  await page.goto(urlTienda('dona-rosa', '/panel/pagina'));
  await expect(page.getByRole('heading', { name: 'Armá tu página' })).toBeVisible();
  await page.getByRole('button', { name: 'Agregar bloque' }).click();
  await page.getByRole('button', { name: /^Texto Un título y un texto libre/ }).click();
  await page.getByRole('button', { name: /^Texto Contá algo de tu negocio/ }).click();
  await page.getByRole('textbox', { name: 'Texto', exact: true }).fill('Amasamos todo acá, desde 1987.');
  await expect(page.getByText('Cambios guardados')).toBeVisible({ timeout: 10000 });
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Publicar' }).click();
  await esperarAviso(page, 'Listo, tu página ya está publicada');

  await page.goto(urlTienda('dona-rosa', '/'));
  await expect(page.getByText('Amasamos todo acá, desde 1987.')).toBeVisible();
  await volverALaDeSiempre(page);
  await page.reload();
  await expect(page.getByText('Amasamos todo acá, desde 1987.')).toHaveCount(0);
});

test('reordenar con el teclado y deshacer', async ({ page }) => {
  await page.goto(urlTienda('dona-rosa', '/panel/pagina'));
  const lista = page.getByRole('list', { name: 'Bloques de tu página' });
  await expect(lista.getByRole('listitem').first()).toContainText('Portada');
  await page.getByRole('button', { name: 'Mover Beneficios' }).focus();
  await page.keyboard.press('Space');
  await expect(page.getByText('Beneficios va al lugar 2.')).toBeAttached();
  await page.keyboard.press('ArrowUp');
  await expect(page.getByText('Beneficios va al lugar 1.')).toBeAttached();
  await page.keyboard.press('Space');
  await expect(lista.getByRole('listitem').first()).toContainText('Beneficios');
  await page.getByRole('button', { name: 'Deshacer' }).click();
  await expect(lista.getByRole('listitem').first()).toContainText('Portada');
  await volverALaDeSiempre(page);
});
