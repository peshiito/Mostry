import { expect, test } from '@playwright/test';
import { esperarAviso } from '../apoyo/avisos.js';
import { urlTienda } from '../apoyo/entorno.js';
import { diaDentroDe } from '../apoyo/fechas.js';
import { SESION_ROSA } from '../apoyo/ingresar.js';

test.use({ storageState: SESION_ROSA });

// Encargos 3: a Rosa le encargan una torta por WhatsApp y le transfieren la
// seña. La carga desde el panel: entra aceptada y queda en la agenda.
test('cargar un encargo que llegó por WhatsApp, con la seña ya cobrada', async ({
  page,
}) => {
  await page.goto(urlTienda('dona-rosa', '/panel/encargos'));
  await page.getByRole('link', { name: 'Cargar' }).click();
  await expect(page.getByRole('heading', { name: 'Cargar encargo' })).toBeVisible();

  await page.getByLabel('Nombre del cliente').fill('Marta WhatsApp');
  await page.getByLabel('WhatsApp').fill('11 4455-6677');
  await page.getByRole('button', { name: 'Día del encargo', exact: true }).click();
  const hoja = page.getByRole('dialog', { name: 'Día del encargo' });
  const dia = diaDentroDe(2);
  if (dia.otroMes) await hoja.getByRole('button', { name: 'Mes siguiente' }).click();
  await hoja.getByRole('button', { name: dia.etiqueta }).click();

  await page
    .getByRole('group', { name: 'Cantidad de Rogel' })
    .getByLabel('Sumar uno')
    .click();
  await page.getByLabel('Nota (opcional)').fill('Con frutillas arriba');
  await page.getByText('Ya me pagó la seña').click();
  await page.getByLabel('¿Cuánto te pagó?').fill('10000');
  await page.getByRole('radio', { name: 'Transferencia' }).click();
  await page.getByRole('button', { name: 'Guardar encargo' }).click();

  await esperarAviso(page, 'Encargo cargado');
  await expect(page.getByText('Cliente · cargado por vos')).toBeVisible();
  await expect(page.getByText('“Con frutillas arriba”')).toBeVisible();
  await expect(page.getByText('Pago aprobado').first()).toBeVisible();
});
