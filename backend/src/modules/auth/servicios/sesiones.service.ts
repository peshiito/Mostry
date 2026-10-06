import type { Request, Response } from 'express';
import { sha256, tokenAleatorio } from '../../../shared/crypto/tokens.js';
import type { TipoSesion } from '../../../shared/db/tipos/usuarios.js';
import { nombreCookie, opcionesCookie as opciones } from '../cookies.js';
import { sesionesRepo, type SesionVigente } from '../repositorios/sesiones.repository.js';

const MIN = 60 * 1000;
const DIA = 24 * 60 * MIN;
const DURACION = { panel: 30 * DIA, admin: 12 * 60 * MIN };

export async function crearSesion(
  req: Request,
  res: Response,
  datos: { usuarioId: number; tipo: TipoSesion },
): Promise<void> {
  const token = tokenAleatorio();
  const expiraEn = new Date(Date.now() + DURACION[datos.tipo]);
  await sesionesRepo.crear({
    ...datos,
    hashToken: sha256(token),
    expiraEn,
    ip: req.ip ?? null,
    userAgent: req.get('user-agent')?.slice(0, 255) ?? null,
  });
  res.cookie(nombreCookie(datos.tipo), token, opciones(expiraEn));
}

export async function cerrarSesion(res: Response, sesion: SesionVigente): Promise<void> {
  await sesionesRepo.borrar(sesion.id);
  res.clearCookie(nombreCookie(sesion.tipo), opciones());
}

// Panel: si le quedan menos de 15 días, se extiende a 30 (sesión deslizante).
export async function renovarSiHaceFalta(
  res: Response,
  sesion: SesionVigente,
  token: string,
) {
  if (sesion.tipo !== 'panel') return;
  if (sesion.expiraEn.getTime() - Date.now() > 15 * DIA) return;
  const expiraEn = new Date(Date.now() + DURACION.panel);
  await sesionesRepo.actualizar(sesion.id, { expiraEn });
  res.cookie(nombreCookie('panel'), token, opciones(expiraEn));
}
