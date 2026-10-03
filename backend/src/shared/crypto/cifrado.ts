import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
import { config } from '../../config/env.js';

const clave = Buffer.from(config.TOTP_CLAVE_CIFRADO, 'base64');

// AES-256-GCM: cifra y además detecta si alguien modificó el dato.
// Formato guardado: iv.tag.datos (base64url).
export function cifrar(texto: string): string {
  const iv = randomBytes(12);
  const cifrador = createCipheriv('aes-256-gcm', clave, iv);
  const datos = Buffer.concat([cifrador.update(texto, 'utf8'), cifrador.final()]);
  return [iv, cifrador.getAuthTag(), datos].map((b) => b.toString('base64url')).join('.');
}

export function descifrar(guardado: string): string {
  const [iv, tag, datos] = guardado.split('.').map((p) => Buffer.from(p, 'base64url'));
  if (!iv || !tag || !datos) throw new Error('Dato cifrado con formato inválido');
  const descifrador = createDecipheriv('aes-256-gcm', clave, iv);
  descifrador.setAuthTag(tag);
  return Buffer.concat([descifrador.update(datos), descifrador.final()]).toString('utf8');
}
