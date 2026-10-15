import type { Request, Response } from 'express';
import { sha256, tokenAleatorio } from '../../../shared/crypto/tokens.js';
import { opcionesCookie as opciones } from '../../auth/cookies.js';
import { sesionesClubRepo, type SesionClubVigente } from './sesionesClub.repository.js';

// Cookie propia del club: host-only de la API, igual que las del panel y el admin.
// Viaja desde cualquier zona de Mostry (en L3 la usa el checkout de las tiendas).
export const COOKIE_CLUB = '__Host-mostry_club';
const DIA = 24 * 60 * 60 * 1000;
const DURACION = 90 * DIA;

export async function crearSesionClub(req: Request, res: Response, clienteId: number) {
  const token = tokenAleatorio();
  const expiraEn = new Date(Date.now() + DURACION);
  await sesionesClubRepo.crear({
    clienteId,
    hashToken: sha256(token),
    expiraEn,
    ip: req.ip ?? null,
    userAgent: req.get('user-agent')?.slice(0, 255) ?? null,
  });
  res.cookie(COOKIE_CLUB, token, opciones(expiraEn));
}

export function borrarCookieClub(res: Response) {
  res.clearCookie(COOKIE_CLUB, opciones());
}

// Sesión deslizante: si le queda menos de la mitad, vuelve a durar 90 días.
export async function renovarSesionClub(
  res: Response,
  sesion: SesionClubVigente,
  token: string,
) {
  if (sesion.expiraEn.getTime() - Date.now() > DURACION / 2) return;
  const expiraEn = new Date(Date.now() + DURACION);
  await sesionesClubRepo.extender(sesion.id, expiraEn);
  res.cookie(COOKIE_CLUB, token, opciones(expiraEn));
}
