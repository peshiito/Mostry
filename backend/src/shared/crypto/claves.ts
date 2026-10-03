import argon2 from 'argon2';

export function hashearClave(clave: string): Promise<string> {
  return argon2.hash(clave, { type: argon2.argon2id });
}

let hashFalso: Promise<string> | undefined;

// Si el usuario no existe igual se verifica contra un hash falso, para tardar
// lo mismo y no revelar qué emails están registrados.
export async function verificarClave(hash: string | undefined, clave: string) {
  hashFalso ??= hashearClave('hash-falso-para-igualar-tiempos');
  const objetivo = hash ?? (await hashFalso);
  try {
    return (await argon2.verify(objetivo, clave)) && hash !== undefined;
  } catch {
    // Hash con formato inválido (ej: usuarios del seed sin clave).
    return false;
  }
}
