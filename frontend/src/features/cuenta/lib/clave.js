// Nivel de seguridad de una contraseña (0 a 3). Mínimo 10 caracteres (sección 7).
export function nivelClave(c) {
  if (c.length < 10) return 0;
  let puntos = 1;
  if (/[A-Z]/.test(c) && /[a-z]/.test(c)) puntos++;
  if (/\d/.test(c) && /[^A-Za-z0-9]/.test(c)) puntos++;
  return puntos;
}

export const TEXTO_NIVEL = ['Mínimo 10 caracteres', 'Aceptable', 'Buena', 'Segura'];
