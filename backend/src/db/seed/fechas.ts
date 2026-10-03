// Fecha UTC a N días de hoy (para planes y pruebas del seed).
export function dentroDeDias(dias: number): Date {
  return new Date(Date.now() + dias * 24 * 60 * 60 * 1000);
}
