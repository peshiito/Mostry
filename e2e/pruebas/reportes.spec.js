import { expect, test } from '@playwright/test';
import { esperarAviso } from '../apoyo/avisos.js';
import { URL_ADMIN, urlTienda } from '../apoyo/entorno.js';
import { SESION_ADMIN, SESION_ROSA } from '../apoyo/ingresar.js';

// La comerciante reporta un problema con captura; el admin lo ve, responde y lo
// resuelve; la tienda ve la respuesta (Etapa 14.5, parte D).
test('reporte con captura: del panel a la bandeja del admin y de vuelta', async ({
  browser,
}) => {
  const rosa = await (await browser.newContext({ storageState: SESION_ROSA })).newPage();
  await rosa.goto(urlTienda('dona-rosa', '/panel/mas'));
  await rosa.getByRole('link', { name: 'Reportar un problema' }).click();
  await rosa.getByLabel('¿Dónde pasó?').selectOption('productos');
  await rosa
    .getByLabel('¿Qué pasó?')
    .fill('Al guardar la foto de la medialuna me sale un error.');
  await rosa.locator('input[type=file]').setInputFiles('archivos/comprobante.png');
  await rosa.getByRole('button', { name: 'Mandar reporte' }).click();
  await expect(rosa.getByRole('heading', { name: /Reporte #\d+ enviado/ })).toBeVisible();
  const aviso = rosa.getByRole('link', { name: 'Avisar a Mostry por WhatsApp' });
  await expect(aviso).toHaveAttribute('href', /^https:\/\/wa\.me\/5491125303909\?text=/);

  const admin = await (
    await browser.newContext({ storageState: SESION_ADMIN })
  ).newPage();
  await admin.goto(`${URL_ADMIN}/reportes`);
  await admin
    .getByRole('button', { name: /Facturería Doña Rosa · #\d+/ })
    .first()
    .click();
  const hoja = admin.getByRole('dialog', { name: 'Reporte' });
  await expect(hoja.getByText('Al guardar la foto de la medialuna')).toBeVisible();
  await expect(hoja.getByRole('img', { name: /Captura del reporte/ })).toBeVisible();
  await hoja.getByRole('radio', { name: 'Resuelto' }).click();
  await hoja.getByLabel('Respuesta para la tienda').fill('Listo, ya lo arreglamos.');
  await hoja.getByRole('button', { name: 'Guardar' }).click();
  await esperarAviso(admin, 'Reporte actualizado');

  await rosa.goto(urlTienda('dona-rosa', '/panel/reportes'));
  await expect(rosa.getByText('Listo, ya lo arreglamos.').first()).toBeVisible();
  await expect(rosa.getByText('Resuelto').first()).toBeVisible();
});
