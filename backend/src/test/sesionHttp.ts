import type { Response } from 'supertest';

export const ORIGEN_SITIO = 'http://localhost:5173';
export const origenTienda = (slug: string) => `http://${slug}.localhost:5173`;

// "__Host-mostry_sesion=xyz" a partir del Set-Cookie de una respuesta.
export function cookieDe(res: Response): string {
  const crudas = res.headers['set-cookie'] as unknown as string[] | undefined;
  const cookie = crudas?.find((c) => c.startsWith('__Host-'))?.split(';')[0];
  if (!cookie) throw new Error(`La respuesta no trajo cookie (status ${res.status})`);
  return cookie;
}
