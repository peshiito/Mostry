import { Secret, TOTP } from 'otpauth';
import { cifrar, descifrar } from '../../../shared/crypto/cifrado.js';
import { usuariosTotpRepo } from '../repositorios/usuariosTotp.repository.js';

const PERIODO_S = 30;

const crearTotp = (email: string, secreto: Secret) =>
  new TOTP({
    issuer: 'Mostry',
    label: email,
    digits: 6,
    period: PERIODO_S,
    secret: secreto,
  });

// Genera un secreto nuevo (pendiente hasta que se active con un código válido).
export async function prepararTotp(usuario: { id: number; email: string }) {
  const secreto = new Secret({ size: 20 });
  await usuariosTotpRepo.guardarTotpPendiente(usuario.id, cifrar(secreto.base32));
  return { uri: crearTotp(usuario.email, secreto).toString(), secreto: secreto.base32 };
}

// Acepta el código actual o el de ±30 s, y cada código sirve una sola vez.
export async function verificarTotp(
  usuario: { id: number; email: string; totpSecretoCifrado: string | null },
  codigo: string,
): Promise<boolean> {
  if (!usuario.totpSecretoCifrado) return false;
  const secreto = Secret.fromBase32(descifrar(usuario.totpSecretoCifrado));
  const delta = crearTotp(usuario.email, secreto).validate({ token: codigo, window: 1 });
  if (delta === null) return false;
  const paso = Math.floor(Date.now() / 1000 / PERIODO_S) + delta;
  return usuariosTotpRepo.usarPasoTotp(usuario.id, paso);
}
