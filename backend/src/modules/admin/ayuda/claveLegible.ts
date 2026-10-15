import { randomInt } from 'node:crypto';

// Sin letras ni números que se confunden al dictarlos por WhatsApp (0/O, 1/l/I).
const CARACTERES = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';

// Clave temporal de 10 caracteres (más de 57 bits): sirve para entrar una vez y
// elegir una nueva. Se muestra al admin una sola vez y se guarda hasheada.
export function claveLegible(largo = 10): string {
  return Array.from(
    { length: largo },
    () => CARACTERES[randomInt(CARACTERES.length)],
  ).join('');
}
