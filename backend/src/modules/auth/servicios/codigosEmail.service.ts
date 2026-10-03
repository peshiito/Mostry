import { hmac, codigoNumerico, igualesSeguro } from '../../../shared/crypto/tokens.js';
import { enviarSinFallar } from '../../../shared/email/enviarSinFallar.js';
import type { Mailer } from '../../../shared/email/mailer.js';
import { plantillas } from '../emails/plantillas.js';
import { codigosEmailRepo } from '../repositorios/codigosEmail.repository.js';

type Proposito = 'verificar_email' | 'recuperar_clave';
const VIGENCIA_MS = 10 * 60 * 1000;

// El HMAC incluye usuario y propósito: un código no sirve para otra cosa.
const hashDe = (usuarioId: number, proposito: Proposito, codigo: string) =>
  hmac(`${usuarioId}:${proposito}:${codigo}`);

export async function emitirCodigo(
  mailer: Mailer,
  usuario: { id: number; email: string },
  proposito: Proposito,
): Promise<void> {
  const codigo = codigoNumerico();
  await codigosEmailRepo.invalidarAnteriores(usuario.id, proposito);
  await codigosEmailRepo.crear({
    usuarioId: usuario.id,
    proposito,
    hashCodigo: hashDe(usuario.id, proposito, codigo),
    expiraEn: new Date(Date.now() + VIGENCIA_MS),
  });
  const plantilla =
    proposito === 'verificar_email'
      ? plantillas.verificarEmail(codigo)
      : plantillas.recuperarClave(codigo);
  await enviarSinFallar(mailer, { para: usuario.email, ...plantilla });
}

// Máximo 5 intentos por código; después hay que pedir otro.
export async function verificarCodigo(
  usuarioId: number,
  proposito: Proposito,
  codigo: string,
): Promise<boolean> {
  const vigente = await codigosEmailRepo.buscarVigente(usuarioId, proposito);
  if (!vigente) return false;
  if (!igualesSeguro(hashDe(usuarioId, proposito, codigo), vigente.hashCodigo)) {
    await codigosEmailRepo.sumarIntento(vigente.id);
    return false;
  }
  return codigosEmailRepo.marcarUsado(vigente.id);
}
