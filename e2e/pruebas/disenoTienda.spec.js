import { expect, test } from '@playwright/test';
import { esperarAviso } from '../apoyo/avisos.js';
import { API } from '../apoyo/forzar.js';
import { urlTienda } from '../apoyo/entorno.js';
import { SESION_ROSA } from '../apoyo/ingresar.js';

test.use({ storageState: SESION_ROSA });

const tokenDeLaPagina = (page, nombre) =>
  page.evaluate(
    (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim(),
    nombre,
  );

// Vidriera 2.0 (V1): el comercio elige un estilo en el panel y la vidriera cambia.
test('elegir el estilo "Calle" cambia los colores y la letra de la vidriera', async ({
  page,
}) => {
  await page.goto(urlTienda('dona-rosa', '/panel/diseno'));
  await expect(page.getByRole('heading', { name: 'Diseño de tu tienda' })).toBeVisible();
  await page.getByText('Ropa urbana, zapatillas y gorras').click();
  await page.getByRole('button', { name: 'Guardar diseño' }).click();
  await esperarAviso(page, 'Listo, tu tienda ya tiene el diseño nuevo');

  await page.goto(urlTienda('dona-rosa', '/'));
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  expect(await tokenDeLaPagina(page, '--lona')).toBe('#141414');
  expect(await tokenDeLaPagina(page, '--fuente-titulo')).toContain('Permanent Marker');

  // Vuelve al diseño de siempre para no cambiarle la cara a los otros recorridos.
  const st = await page.evaluate(
    async (api) =>
      (
        await fetch(`${api}/panel/tienda/tema`, {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            base: 'clasico',
            colores: { principal: '#0e5a4a', acento: '#f2b53a', fondo: '#f7f3ec' },
            fuentes: { titulos: 'rubik', texto: 'work-sans' },
            forma: 'suave',
            encabezado: 'toldo',
            fondo: { tipo: 'liso', patron: 'ninguno', intensidad: 40 },
            plantilla: 'clasica',
          }),
        })
      ).status,
    API,
  );
  expect(st).toBe(200);
});
