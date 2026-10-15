import { expect } from '@playwright/test';
import { esperarAviso } from './avisos.js';
import { urlTienda } from './entorno.js';
import { diaDentroDe } from './fechas.js';
import { SESION_ROSA } from './ingresar.js';

// El comprador agrega un producto y llega a elegir día y hora del encargo.
export async function encargarHasta(page, producto, nombre) {
  await page.goto(urlTienda('dona-rosa', '/catalogo'));
  await page.getByText(producto).first().click();
  await page.getByRole('button', { name: 'Agregar' }).click();
  await esperarAviso(page, `Agregaste 1 × ${producto}`);
  await page.getByRole('link', { name: /Continuar/ }).click();
  await page.getByLabel('Nombre y apellido').fill(nombre);
  await page.getByLabel('WhatsApp').fill('11 3344-5566');
  await page.getByRole('button', { name: 'Elegir día y hora' }).click();
  await expect(
    page.getByRole('heading', { name: '¿Para cuándo lo querés?' }),
  ).toBeVisible();
  const dia = diaDentroDe(3);
  if (dia.otroMes) await page.getByRole('button', { name: 'Mes siguiente' }).click();
  await page.getByRole('button', { name: dia.etiqueta }).click();
  await page
    .getByRole('group', { name: 'Horario de retiro o entrega' })
    .getByRole('button')
    .first()
    .click();
}

// Rosa, en otra pestaña con su sesión, abre el encargo desde "Por aceptar".
export async function rosaAbreElEncargo(browser, nombre) {
  const contexto = await browser.newContext({ storageState: SESION_ROSA });
  const rosa = await contexto.newPage();
  await rosa.goto(urlTienda('dona-rosa', '/panel/encargos'));
  await rosa.getByRole('link', { name: new RegExp(nombre) }).click();
  return { rosa, contexto };
}
