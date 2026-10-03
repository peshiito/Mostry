import { codigoRecuperacion, hmac } from '../../../shared/crypto/tokens.js';
import { codigosRecuperacionRepo } from '../repositorios/codigosRecuperacion.repository.js';
import type { Usuario } from '../repositorios/usuarios.repository.js';
import { verificarTotp } from './totp.service.js';

export type SegundoFactor = { codigoTotp?: string; codigoRecuperacion?: string };

const hashRecuperacion = (usuarioId: number, codigo: string) =>
  hmac(`${usuarioId}:${codigo.toLowerCase()}`);

// 10 códigos de un solo uso. Se muestran una única vez.
export async function generarCodigosRecuperacion(usuarioId: number): Promise<string[]> {
  const codigos = Array.from({ length: 10 }, codigoRecuperacion);
  await codigosRecuperacionRepo.reemplazar(
    usuarioId,
    codigos.map((c) => hashRecuperacion(usuarioId, c)),
  );
  return codigos;
}

// TOTP de la app o, si perdió el celular, un código de recuperación.
export async function verificarSegundoFactor(
  usuario: Usuario,
  { codigoTotp, codigoRecuperacion }: SegundoFactor,
): Promise<boolean> {
  if (!usuario.totpActivadoEn) return false;
  if (codigoTotp) return verificarTotp(usuario, codigoTotp);
  if (codigoRecuperacion) {
    return codigosRecuperacionRepo.usar(
      usuario.id,
      hashRecuperacion(usuario.id, codigoRecuperacion),
    );
  }
  return false;
}
