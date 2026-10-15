import { randomInt } from 'node:crypto';
import { hmac } from '../../../shared/crypto/tokens.js';

// Sin 0/O, 1/I/L: se dicta y se tipea sin confusiones. 31^6 ≈ 887 millones.
export const ALFABETO_QR = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
export const LARGO_QR = 6;
export const VENTANA_MS = 5 * 60 * 1000;
// Después de rotar, el código anterior sigue sirviendo 1 minuto más: por si el
// cliente lo mostró justo al cambiar.
export const MARGEN_MS = 60 * 1000;

const deBytes = (hex: string) =>
  Array.from({ length: LARGO_QR }, (_, i) => {
    const n = parseInt(hex.slice(i * 4, i * 4 + 4), 16);
    return ALFABETO_QR[n % ALFABETO_QR.length];
  }).join('');

// El código de un cliente en una ventana de 5 minutos: siempre el mismo dentro de
// la ventana (sin guardarlo en claro) e imposible de adivinar sin el secreto.
export const codigoDeVentana = (clienteId: number, ventana: number) =>
  deBytes(hmac(`qr:${clienteId}:${ventana}`));

export const codigoAlAzar = () =>
  Array.from({ length: LARGO_QR }, () => ALFABETO_QR[randomInt(ALFABETO_QR.length)]).join(
    '',
  );

// En la base se guarda el HMAC: un dump no alcanza para usar códigos vigentes.
export const hashQr = (codigo: string) => hmac(`qr-guardado:${codigo}`);

export const ventanaDe = (ms: number) => Math.floor(ms / VENTANA_MS);
