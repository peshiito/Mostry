import { vi } from 'vitest';
import { respuesta } from './rutasApi.js';

// Reemplaza fetch por respuestas grabadas. Lo que no está grabado devuelve 404.
export function usarApiFalsa({ admin = false } = {}) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url, opciones = {}) => {
      const { pathname, search } = new URL(url);
      const datos = respuesta(opciones.method ?? 'GET', pathname + search, admin);
      const status = datos === undefined ? 404 : 200;
      const cuerpo =
        datos === undefined
          ? { error: { codigo: 'no_encontrado', mensaje: 'No existe' } }
          : datos;
      return new Response(JSON.stringify(cuerpo), {
        status,
        headers: { 'Content-Type': 'application/json' },
      });
    }),
  );
}
