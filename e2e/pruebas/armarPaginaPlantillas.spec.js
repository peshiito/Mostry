import { expect, test } from '@playwright/test';
import { esperarAviso } from '../apoyo/avisos.js';
import { abrirEditor } from '../apoyo/editor.js';
import { API } from '../apoyo/forzar.js';
import { urlTienda } from '../apoyo/entorno.js';
import { SESION_ROSA } from '../apoyo/ingresar.js';

test.use({ storageState: SESION_ROSA });

const bloques = (page) => page.getByRole('list', { name: 'Bloques de tu página' });
const borrarPagina = (page) =>
  page.evaluate(
    (api) =>
      fetch(`${api}/panel/tienda/pagina`, { method: 'DELETE', credentials: 'include' }),
    API,
  );

// "Armá tu página" (P5): la primera vez se ofrece la plantilla del estilo; después
// se cambia de plantilla, se deshace, se vuelve a una versión y a la de siempre.
test('plantillas, versiones y volver a la de siempre', async ({ page }) => {
  // Sin estilo ni rubro no hay sugerida: se elige de la lista.
  await abrirEditor(page, 'dona-rosa', 'Ver las plantillas');
  await page.getByRole('button', { name: 'Usar la plantilla Horno' }).click();
  await esperarAviso(page, 'Pusimos la plantilla Horno');
  await expect(page.getByText('Cambios guardados')).toBeVisible({ timeout: 10000 });
  await page.reload();
  await expect(page.getByRole('button', { name: 'Publicar' })).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(0);

  await page.getByRole('button', { name: 'Publicar' }).click();
  await esperarAviso(page, 'Listo, tu página ya está publicada');

  await page.getByRole('button', { name: 'Más', exact: true }).click();
  await page.getByRole('button', { name: 'Cambiar de plantilla' }).click();
  await page.getByRole('button', { name: 'Usar la plantilla Bodega' }).click();
  await esperarAviso(page, 'Pusimos la plantilla Bodega');
  await expect(bloques(page).getByText('Galería')).toBeVisible();
  await page.getByRole('button', { name: 'Deshacer', exact: true }).first().click();
  await expect(bloques(page).getByText('Galería')).toHaveCount(0);

  await page.getByRole('button', { name: 'Más', exact: true }).click();
  await page.getByRole('button', { name: 'Volver a esta' }).first().click();
  await esperarAviso(page, /la versión quedó en el borrador/);

  await page.getByRole('button', { name: 'Más', exact: true }).click();
  await page.getByRole('button', { name: 'Volver a la de siempre' }).click();
  await page.getByRole('button', { name: 'Sí, sacar mi página publicada' }).click();
  await esperarAviso(page, 'Tu tienda volvió a la página de siempre');
  await expect(page.getByText('Cambios guardados')).toBeVisible({ timeout: 10000 });
  await borrarPagina(page);
});
