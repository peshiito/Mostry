const formato = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

// Centavos → "$ 35.000" (la plata se guarda siempre en centavos, CLAUDE.md 5).
export const formatearPlata = (centavos: number) => formato.format(centavos / 100);
