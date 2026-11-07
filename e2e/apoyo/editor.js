import { expect } from '@playwright/test';
import { urlTienda } from './entorno.js';

// Abre "Armá tu página". Si es la primera vez, la bienvenida ofrece plantillas:
// `plantilla` null sigue con la de siempre (lo que esperan las pruebas de antes).
export async function abrirEditor(page, slug, plantilla = null) {
  await page.goto(urlTienda(slug, '/panel/pagina'));
  const hoja = page.getByRole('dialog', {
    name: /Tu página, armada|Elegí cómo arrancar/,
  });
  await expect(page.getByRole('button', { name: 'Publicar' })).toBeVisible();
  const hay = await hoja
    .waitFor({ state: 'visible', timeout: 1500 })
    .then(() => true)
    .catch(() => false);
  if (!hay) return;
  const boton = plantilla ?? 'Seguir con la de siempre';
  await hoja.getByRole('button', { name: boton }).click();
  if (boton !== 'Ver las plantillas') await expect(hoja).toBeHidden();
}
