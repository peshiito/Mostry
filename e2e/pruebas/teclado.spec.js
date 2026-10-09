import { expect, test } from '@playwright/test';
import { urlTienda } from '../apoyo/entorno.js';

// Navegación solo con teclado (WCAG 2.1.1 y 2.4.1).
test('con Tab aparece "Saltar al contenido" y Enter lleva al contenido', async ({
  page,
}) => {
  await page.goto(urlTienda('dona-rosa', '/catalogo'));
  await expect(page.locator('#contenido')).toBeAttached(); // que termine de cargar
  await page.keyboard.press('Tab');
  const saltar = page.getByRole('link', { name: 'Saltar al contenido' });
  await expect(saltar).toBeFocused();
  await expect(saltar).toBeInViewport();
  await page.keyboard.press('Enter');
  await expect(page.locator('#contenido')).toBeFocused();
});

test('al navegar, el foco va al título de la pantalla nueva', async ({ page }) => {
  await page.goto(urlTienda('dona-rosa', '/catalogo'));
  await page.getByText('Medialuna de manteca').first().click();
  await expect(page.locator('h1')).toBeFocused();
});
