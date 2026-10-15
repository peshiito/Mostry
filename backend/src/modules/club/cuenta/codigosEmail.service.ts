import { codigoNumerico, hmac, igualesSeguro } from '../../../shared/crypto/tokens.js';
import { enviarSinFallar } from '../../../shared/email/enviarSinFallar.js';
import type { Mailer } from '../../../shared/email/mailer.js';
import { codigosEmailClubRepo as repo } from './codigosEmailClub.repository.js';
import { plantillasClub } from './plantillas.js';

type Proposito = 'verificar_email' | 'recuperar_clave';
const VIGENCIA_MS = 10 * 60 * 1000;

// El HMAC lleva "club", el cliente y el propósito: un código no sirve para otra cosa
// (ni para una cuenta del panel con el mismo id).
const hashDe = (clienteId: number, proposito: Proposito, codigo: string) =>
  hmac(`club:${clienteId}:${proposito}:${codigo}`);

export async function emitirCodigoClub(
  mailer: Mailer,
  cliente: { id: number; email: string },
  proposito: Proposito,
): Promise<void> {
  const codigo = codigoNumerico();
  await repo.invalidarAnteriores(cliente.id, proposito);
  await repo.crear({
    clienteId: cliente.id,
    proposito,
    hashCodigo: hashDe(cliente.id, proposito, codigo),
    expiraEn: new Date(Date.now() + VIGENCIA_MS),
  });
  const plantilla =
    proposito === 'verificar_email'
      ? plantillasClub.verificarEmail(codigo)
      : plantillasClub.recuperarClave(codigo);
  await enviarSinFallar(mailer, { para: cliente.email, ...plantilla });
}

// Máximo 5 intentos por código; después hay que pedir otro.
export async function verificarCodigoClub(
  clienteId: number,
  proposito: Proposito,
  codigo: string,
): Promise<boolean> {
  const vigente = await repo.buscarVigente(clienteId, proposito);
  if (!vigente) return false;
  if (!igualesSeguro(hashDe(clienteId, proposito, codigo), vigente.hashCodigo)) {
    await repo.sumarIntento(vigente.id);
    return false;
  }
  return repo.marcarUsado(vigente.id);
}
