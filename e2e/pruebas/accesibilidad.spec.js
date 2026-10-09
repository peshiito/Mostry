import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { URL_ADMIN, URL_SITIO, urlTienda } from '../apoyo/entorno.js';
import { SESION_ADMIN, SESION_ROSA } from '../apoyo/ingresar.js';

// Auditoría automática (axe, WCAG 2.1 AA) de las pantallas principales, en modo
// claro y oscuro. Falla con cualquier problema serio o crítico.
const tienda = (r) => urlTienda('dona-rosa', r);
const PANTALLAS = {
  publico: [
    URL_SITIO,
    `${URL_SITIO}/registro`,
    tienda('/'),
    tienda('/catalogo'),
    tienda('/carrito'),
    tienda('/panel/ingresar'),
  ],
  rosa: [
    '/panel',
    '/panel/pedidos',
    '/panel/caja',
    '/panel/productos',
    '/panel/libreta',
    '/panel/tienda',
    '/panel/horarios',
    '/panel/mas',
  ].map(tienda),
  admin: [URL_ADMIN],
};
const SESIONES = { publico: undefined, rosa: SESION_ROSA, admin: SESION_ADMIN };

for (const esquema of ['light', 'dark'])
  for (const [quien, urls] of Object.entries(PANTALLAS))
    test.describe(`${quien} · ${esquema === 'dark' ? 'oscuro' : 'claro'}`, () => {
      test.use({ colorScheme: esquema, storageState: SESIONES[quien] });
      for (const url of urls)
        test(url.replace(/^https?:\/\//, ''), async ({ page }) => {
          await page.goto(url);
          await expect(page.locator('h1').first()).toBeVisible();
          await page.waitForTimeout(400); // que terminen las animaciones de entrada
          const { violations } = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .analyze();
          const graves = violations
            .filter((v) => ['serious', 'critical'].includes(v.impact))
            .map(
              (v) =>
                `${v.id}: ${v.help} → ${v.nodes
                  .map((n) => n.target.join(' '))
                  .slice(0, 3)
                  .join(' | ')}`,
            );
          expect(graves).toEqual([]);
        });
    });
