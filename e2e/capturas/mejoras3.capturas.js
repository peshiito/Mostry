import { expect, test } from '@playwright/test';
import { urlTienda } from '../apoyo/entorno.js';
import { ingresar } from '../apoyo/ingresar.js';
import { tiendaNueva } from '../apoyo/tiendaNueva.js';
import { foto } from './foto.js';

// Capturas de Mejoras 3: preguntas del inicio, "solo caja", Vender y tarjeta.
test.use({ colorScheme: 'light' });

test('armá tu Mostry, vender y tarjeta de presentación', async ({ page }) => {
  const t = await tiendaNueva('fotos');
  await ingresar(page, urlTienda(t.slug, '/panel/ingresar'), t.email);
  await page.getByText('Vender por internet con mi tienda').click();
  await foto(page, 'claro', 'm3-01-que-hacés');
  await page.getByRole('button', { name: 'Seguir' }).click();
  await page.getByRole('button', { name: 'Panadería o facturería' }).click();
  await foto(page, 'claro', 'm3-02-rubro');
  await page.getByRole('button', { name: 'Seguir' }).click();
  await foto(page, 'claro', 'm3-03-stock');
  await page.getByRole('button', { name: 'Seguir' }).click();
  await foto(page, 'claro', 'm3-04-resumen');
  await page.getByRole('button', { name: 'Empezar' }).click();
  await expect(page.getByText('Anotá cada venta del local')).toBeVisible();
  await foto(page, 'claro', 'm3-05-inicio-solo-caja');
  await page.goto(urlTienda(t.slug, '/panel/vender'));
  await page.getByRole('button', { name: 'Monto suelto' }).click();
  await page.getByRole('dialog').getByLabel('Monto').fill('2500');
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Agregar a la venta' })
    .click();
  await foto(page, 'claro', 'm3-06-vender');
  await page.goto(urlTienda(t.slug, '/'));
  await foto(page, 'claro', 'm3-07-tarjeta-presentacion');
});
