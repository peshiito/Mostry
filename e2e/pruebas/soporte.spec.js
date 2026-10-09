import { expect, test } from '@playwright/test';
import { esperarAviso } from '../apoyo/avisos.js';
import { URL_ADMIN, urlTienda } from '../apoyo/entorno.js';
import { SESION_ADMIN, SESION_ROSA } from '../apoyo/ingresar.js';

// Modo soporte (Etapa 14.5, parte E): la comerciante da permiso, el admin corrige
// un producto, ella ve qué se cambió y corta el acceso.
test('permiso de soporte: dar, corregir, ver el registro y cortar', async ({
  browser,
}) => {
  const rosa = await (await browser.newContext({ storageState: SESION_ROSA })).newPage();
  await rosa.goto(urlTienda('dona-rosa', '/panel/soporte'));
  await expect(rosa.getByText('Nunca ve')).toBeVisible();
  await rosa.getByRole('button', { name: 'Dar acceso a Mostry por 1 hora' }).click();
  await esperarAviso(rosa, 'Le diste acceso a Mostry por 1 hora');

  const admin = await (
    await browser.newContext({ storageState: SESION_ADMIN })
  ).newPage();
  await admin.goto(URL_ADMIN);
  await admin.getByRole('link', { name: 'Facturería Doña Rosa' }).first().click();
  await admin.getByRole('link', { name: 'Entrar en modo soporte' }).click();
  await expect(admin.getByText('Modo soporte · Facturería Doña Rosa')).toBeVisible();
  await admin
    .getByRole('link', { name: /Medialuna de manteca/ })
    .first()
    .click();
  await admin.getByLabel('Precio').fill('450');
  await admin.getByRole('button', { name: 'Guardar', exact: true }).click();
  await esperarAviso(admin, 'Cambios guardados');

  await rosa.reload();
  await expect(rosa.getByText('Editó un producto: «Medialuna de manteca»')).toBeVisible();
  await rosa.getByRole('button', { name: 'Cortar acceso ahora' }).click();
  await esperarAviso(rosa, 'Cortaste el acceso');

  await admin.reload();
  await expect(
    admin.getByRole('heading', { name: 'Esta tienda no te dio acceso de soporte' }),
  ).toBeVisible();
});
