import { expect, test } from '@playwright/test';
import { esperarAviso } from '../apoyo/avisos.js';
import { urlTienda } from '../apoyo/entorno.js';
import { SESION_ROSA } from '../apoyo/ingresar.js';

test.use({ storageState: SESION_ROSA });

// Carga de productos (CLAUDE.md 3.3): lo que crea la comerciante aparece en su tienda.
test('crear un producto con foto y verlo en la tienda pública', async ({ page }) => {
  await page.goto(urlTienda('dona-rosa', '/panel/productos/nuevo'));
  await page.getByLabel('Nombre', { exact: true }).fill('Pastafrola de membrillo');
  await page.getByLabel('Precio', { exact: true }).fill('6500');
  await page.getByLabel('Stock', { exact: true }).fill('8');
  await page.getByLabel('Descripción').fill('Masa casera, para 6 porciones.');
  await page.getByRole('button', { name: 'Guardar' }).click();
  await esperarAviso(page, 'Producto creado');

  // Después de crearlo, la misma pantalla deja agregar fotos.
  await expect(page.getByRole('heading', { name: 'Editar producto' })).toBeVisible();
  await page.locator('input[type=file]').setInputFiles('archivos/producto.png');
  await esperarAviso(page, 'Foto agregada');

  await page.goto(urlTienda('dona-rosa', '/catalogo'));
  const fila = page.getByRole('listitem').filter({ hasText: 'Pastafrola de membrillo' });
  await expect(fila).toBeVisible();
  await expect(fila.getByText(/6\.500/)).toBeVisible();
  // La foto se sirve como WebP desde el bucket público (reprocesada).
  await expect(fila.locator('img[src*=".webp"]')).toBeVisible();
});
