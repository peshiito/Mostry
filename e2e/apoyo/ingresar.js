import { esperarAviso } from './avisos.js';
import { CLAVE } from './entorno.js';

// Ingreso por la pantalla real (email + contraseña) desde la zona `url`.
export async function ingresar(page, url, email, clave = CLAVE) {
  await page.goto(url);
  await page.getByLabel('Email').fill(email);
  await page.getByLabel(/^Contraseña/).fill(clave);
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await esperarAviso(page, '¡Hola de nuevo!');
}

// Sesiones guardadas por sesiones.setup.js (se reusan en todos los recorridos).
export const SESION_ROSA = '.sesiones/rosa.json';
export const SESION_ADMIN = '.sesiones/admin.json';
