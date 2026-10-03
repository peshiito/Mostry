import { esSubdominioReservado } from './subdominiosReservados.js';

export type Zona =
  { tipo: 'sitio' } | { tipo: 'admin' } | { tipo: 'tienda'; slug: string };

// 3 a 30 caracteres, a-z 0-9 y guiones, sin guion al principio ni al final.
const FORMATO_SLUG = /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/;

export function esSlugValido(slug: string): boolean {
  return FORMATO_SLUG.test(slug) && !slug.includes('--') && !esSubdominioReservado(slug);
}

// Traduce el header Origin a la zona del frontend que hace la request.
// null = origen desconocido (no se le permite CORS ni escribir).
export function zonaDesdeOrigen(
  origen: string | undefined,
  dominioBase: string,
  protocolo: 'http' | 'https',
): Zona | null {
  if (!origen) return null;
  let url: URL;
  try {
    url = new URL(origen);
  } catch {
    return null;
  }
  if (url.protocol !== `${protocolo}:` || url.origin !== origen) return null;
  if (protocolo === 'https' && url.port !== '') return null;

  const host = url.hostname;
  if (host === dominioBase || host === `www.${dominioBase}`) return { tipo: 'sitio' };
  if (!host.endsWith(`.${dominioBase}`)) return null;

  const subdominio = host.slice(0, -(dominioBase.length + 1));
  if (subdominio === 'admin') return { tipo: 'admin' };
  return esSlugValido(subdominio) ? { tipo: 'tienda', slug: subdominio } : null;
}
