import { z } from 'zod';
import { esquemaEnv } from './esquema.js';

// Única fuente de configuración: process.env validado al arrancar.
const resultado = esquemaEnv.safeParse(process.env);

if (!resultado.success) {
  throw new Error(`Configuración inválida:\n${z.prettifyError(resultado.error)}`);
}

const datos = resultado.data;

export const config = {
  ...datos,
  // Los tests nunca tocan la base de desarrollo.
  nombreBase: datos.NODE_ENV === 'test' ? datos.DB_NOMBRE_TEST! : datos.DB_NOMBRE,
};

export type Config = typeof config;
