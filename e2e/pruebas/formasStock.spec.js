import { expect, test } from '@playwright/test';
import { esperarAviso } from '../apoyo/avisos.js';
import { urlTienda } from '../apoyo/entorno.js';
import { SESION_ROSA } from '../apoyo/ingresar.js';

test.use({ storageState: SESION_ROSA });

// Formas de stock (Mejoras 3): el pan no se cuenta, la torta se hace a pedido.
test('un producto "hay / no hay" se crea sin stock y se corta de un toque', async ({
  page,
}) => {
  await page.goto(urlTienda('dona-rosa', '/panel/productos/nuevo'));
  await page.getByLabel('Nombre', { exact: true }).fill('Bizcochitos de grasa');
  await page.getByLabel('Precio', { exact: true }).fill('1800');
  await page.getByText('Solo marco si hay o no hay').click();
  await expect(page.getByLabel('Stock', { exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Guardar' }).click();
  await esperarAviso(page, 'Producto creado');

  await page.goto(urlTienda('dona-rosa', '/panel/productos'));
  const hay = page.getByRole('button', { name: /Bizcochitos de grasa: hay/ });
  await hay.click();
  await expect(
    page.getByRole('button', { name: /Bizcochitos de grasa: no hay/ }),
  ).toBeVisible();

  // En la tienda ya no se puede agregar.
  await page.goto(urlTienda('dona-rosa', '/catalogo'));
  const fila = page.getByRole('listitem').filter({ hasText: 'Bizcochitos de grasa' });
  await expect(fila.getByText('Agotado')).toBeVisible();
});

test('el pan (hay / no hay) se compra sin cantidad y la torta solo se encarga', async ({
  page,
}) => {
  await page.goto(urlTienda('dona-rosa', '/catalogo'));
  const pan = page.getByRole('listitem').filter({ hasText: 'Pan francés' });
  await expect(pan.getByRole('button', { name: /Sumar/ })).toBeVisible();
  const rogel = page.getByRole('listitem').filter({ hasText: 'Rogel' });
  await expect(rogel.getByRole('link', { name: 'Encargar' })).toBeVisible();
  await expect(rogel.getByRole('button', { name: /Sumar/ })).toHaveCount(0);
});
