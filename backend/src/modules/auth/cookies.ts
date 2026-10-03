import type { CookieOptions, Request } from 'express';
import type { TipoSesion } from '../../shared/db/tipos/usuarios.js';
import { zonaDelOrigen } from '../../shared/utils/origen.js';

// __Host-: solo HTTPS, sin Domain (host-only de la API) y path "/".
export const nombreCookie = (tipo: TipoSesion) =>
  tipo === 'admin' ? '__Host-mostry_admin' : '__Host-mostry_sesion';

export const opcionesCookie = (expires?: Date): CookieOptions => ({
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  path: '/',
  ...(expires && { expires }),
});

export const tipoDeZona = (req: Request): TipoSesion =>
  zonaDelOrigen(req.get('origin'))?.tipo === 'admin' ? 'admin' : 'panel';
