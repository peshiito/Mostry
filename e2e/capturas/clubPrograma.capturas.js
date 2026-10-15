import { expect, test } from '@playwright/test';
import { sql } from '../apoyo/base.js';
import { agregarPremio, guardarYPrender, yaConfigurada } from '../apoyo/clubPanel.js';
import { urlTienda } from '../apoyo/entorno.js';
import { ingresar } from '../apoyo/ingresar.js';
import { tiendaNueva } from '../apoyo/tiendaNueva.js';
import { ESQUEMAS, foto } from './foto.js';

// Capturas de Lealtad L2: el club en el panel y la franja en la vidriera.
for (const [esquema, colorScheme] of ESQUEMAS) {
  test(`club del panel ${esquema}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    const t = await tiendaNueva(`fclub${esquema[0]}`);
    await yaConfigurada(sql, t.slug);
    await ingresar(page, urlTienda(t.slug, '/panel/ingresar'), t.email);
    await page.goto(urlTienda(t.slug, '/panel/club'));
    await foto(page, esquema, 'l2-01-club-vacio', true);
    await page.getByRole('button', { name: 'Agregar premio' }).click();
    await page.getByRole('dialog').getByLabel('Porcentaje').fill('20');
    await foto(page, esquema, 'l2-02-hoja-premio');
    await page.getByRole('dialog').getByRole('button', { name: 'Listo' }).click();
    await agregarPremio(page, { compras: 7, tipo: 'Porcentaje', valor: 75 });
    await page.getByRole('button', { name: /A las 7 compras/ }).click();
    await page.getByRole('dialog').getByLabel('Tope (opcional)').fill('10000');
    await page.getByRole('dialog').getByRole('button', { name: 'Listo' }).click();
    await agregarPremio(page, {
      compras: 10,
      tipo: 'Regalo',
      regalo: 'Una docena de facturas',
    });
    await guardarYPrender(page);
    await expect(page.getByRole('switch', { name: /Club prendido/ })).toBeChecked();
    await foto(page, esquema, 'l2-03-club-armado', true);
    await page.goto(urlTienda(t.slug, '/'));
    await expect(page.getByText(/^Sumá sellos con el Club/)).toBeVisible();
    await foto(page, esquema, 'l2-04-vidriera', true);
    await page.goto(urlTienda(t.slug, '/panel/uso'));
    await foto(page, esquema, 'l2-05-que-uso', true);
  });
}
