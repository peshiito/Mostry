import {
  createHash,
  createHmac,
  randomBytes,
  randomInt,
  timingSafeEqual,
} from 'node:crypto';
import { config } from '../../config/env.js';

// 256 bits aleatorios en base64url (cookies de sesión, tokens de seguimiento).
export function tokenAleatorio(): string {
  return randomBytes(32).toString('base64url');
}

export function sha256(valor: string): string {
  return createHash('sha256').update(valor).digest('hex');
}

// Para códigos cortos: con HMAC, un dump de la base no alcanza para adivinarlos.
export function hmac(valor: string): string {
  return createHmac('sha256', config.SECRETO_HMAC).update(valor).digest('hex');
}

// Código de 6 dígitos para emails.
export function codigoNumerico(): string {
  return randomInt(0, 1_000_000).toString().padStart(6, '0');
}

// Comparación en tiempo constante (evita ataques por tiempo de respuesta).
export function igualesSeguro(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
