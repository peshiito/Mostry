import { expect, test } from '@playwright/test';
import { esperarAviso } from '../apoyo/avisos.js';
import { URL_SITIO, urlTienda } from '../apoyo/entorno.js';
import { ultimoCodigo } from '../apoyo/mailpit.js';

// Un comercio nuevo se da de alta solo (CLAUDE.md 6.5): registro en el sitio,
// código por email, ingreso a su panel y 10 días de prueba.
test('registro de un comercio: alta, verificación por email y primer ingreso', async ({
  page,
}) => {
  const slug = `almacen-${Date.now().toString(36)}`;
  const email = `${slug}@prueba.test`;
  const clave = 'una-clave-bien-larga';

  await page.goto(`${URL_SITIO}/registro`);
  await page.getByLabel('Email').fill(email);
  await page.getByLabel(/^Contraseña/).fill(clave);
  await page.getByLabel('Tu nombre').fill('Beatriz Fernández');
  await page.getByLabel('Nombre del negocio').fill('Almacén Doña Tita');
  await page.getByLabel('Tu link en Mostry').fill(slug);
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Crear mi tienda' }).click();

  await expect(page.getByRole('heading', { name: 'Revisá tu email' })).toBeVisible();
  const codigo = await ultimoCodigo(email);
  for (const [i, digito] of [...codigo].entries())
    await page.getByLabel(`Dígito ${i + 1}`).fill(digito);
  await page.getByRole('button', { name: 'Verificar' }).click();
  await expect(page.getByText('¡Listo! Tu email quedó verificado.')).toBeVisible();

  await page.goto(urlTienda(slug, '/panel/ingresar'));
  await page.getByLabel('Email').fill(email);
  await page.getByLabel(/^Contraseña/).fill(clave);
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await esperarAviso(page, '¡Hola de nuevo!');
  await expect(page.getByText('Almacén Doña Tita').first()).toBeVisible();
  await expect(page.getByText('Te quedan 10 días de prueba')).toBeVisible();
});
