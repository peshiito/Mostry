import { AppError } from '../../../shared/errors/AppError.js';
import { codigoInvalido, sinSesion } from '../errores.js';
import { usuariosRepo } from '../repositorios/usuarios.repository.js';
import { usuariosTotpRepo } from '../repositorios/usuariosTotp.repository.js';
import {
  generarCodigosRecuperacion,
  verificarSegundoFactor,
  type SegundoFactor,
} from './segundoFactor.service.js';
import { prepararTotp, verificarTotp } from './totp.service.js';

async function usuarioDe(usuarioId: number) {
  const usuario = await usuariosRepo.buscarPorId(usuarioId);
  if (!usuario) throw sinSesion();
  return usuario;
}

export async function prepararTotpDe(usuarioId: number) {
  const usuario = await usuarioDe(usuarioId);
  if (usuario.totpActivadoEn)
    throw new AppError(409, 'totp_ya_activo', 'Ya tenés la app configurada.');
  return prepararTotp(usuario);
}

// Confirma la app con un código y devuelve los 10 códigos de recuperación.
export async function activarTotpDe(
  usuarioId: number,
  codigoTotp: string,
): Promise<string[]> {
  const usuario = await usuarioDe(usuarioId);
  if (usuario.totpActivadoEn)
    throw new AppError(409, 'totp_ya_activo', 'Ya tenés la app configurada.');
  if (!(await verificarTotp(usuario, codigoTotp))) throw codigoInvalido();
  await usuariosTotpRepo.activarTotp(usuario.id);
  return generarCodigosRecuperacion(usuario.id);
}

export async function verificarSegundoFactorDe(usuarioId: number, datos: SegundoFactor) {
  if (!(await verificarSegundoFactor(await usuarioDe(usuarioId), datos)))
    throw codigoInvalido();
}
