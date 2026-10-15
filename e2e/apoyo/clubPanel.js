import { expect } from '@playwright/test';
import { esperarAviso } from './avisos.js';

// Agrega un premio desde la hoja del panel (Club de clientes).
export async function agregarPremio(page, { compras, tipo, valor, regalo }) {
  await page.getByRole('button', { name: 'Agregar premio' }).click();
  const hoja = page.getByRole('dialog');
  await expect(hoja.getByRole('heading', { name: 'Nuevo premio' })).toBeVisible();
  for (let n = 5; n < compras; n++)
    await hoja.getByRole('button', { name: 'Sumar uno' }).click();
  await hoja.getByRole('radio', { name: tipo }).click();
  if (valor) await hoja.getByLabel('Porcentaje').fill(String(valor));
  if (regalo) await hoja.getByLabel('Qué regalás').fill(regalo);
  await hoja.getByRole('button', { name: 'Listo' }).click();
  await expect(hoja).toBeHidden();
}

// Arma el club de ejemplo (20 % a las 5, regalo a las 10), lo guarda y lo prende.
export async function armarClub(page) {
  await agregarPremio(page, { compras: 5, tipo: 'Porcentaje', valor: 20 });
  await agregarPremio(page, {
    compras: 10,
    tipo: 'Regalo',
    regalo: 'Un café con medialunas',
  });
  await guardarYPrender(page);
}

// Mínimo $ 3.000 y sellos de 6 meses; guarda y prende el club.
export async function guardarYPrender(page) {
  await page.getByLabel(/^Compra mínima/).fill('3000');
  await page.getByRole('radio', { name: '6 meses' }).click();
  await page.getByRole('button', { name: 'Guardar cambios' }).click();
  await esperarAviso(page, 'Guardamos tu club');
  await page.getByRole('switch', { name: /Club prendido/ }).click();
  await esperarAviso(page, 'Tu club está prendido');
}

// Una tienda nueva que ya contestó "Armá tu Mostry" (va directo al panel).
export const yaConfigurada = (sql, slug) =>
  sql('UPDATE tiendas SET configurada_en = NOW() WHERE slug = ?', [slug]);
