// Reglas de plata del pedido, en un solo lugar (montos en centavos).

// Lo que el comprador tiene que transferir ahora: la seña si es un encargo con
// seña, si no el total.
export const montoAPagar = (p: { sena: number; total: number }) => p.sena || p.total;

// Lo que falta cobrar al entregar un encargo (el resto después de la seña).
export const restoACobrar = (p: { sena: number; total: number }) => p.total - p.sena;

// Seña = porcentaje del total, redondeada al peso, nunca mayor que el total.
// Si el redondeo la deja en 0 pero hay porcentaje, se cobra sin redondear.
export function calcularSena({
  total,
  porcentaje,
}: {
  total: number;
  porcentaje: number;
}): number {
  if (porcentaje <= 0) return 0;
  const exacta = (total * porcentaje) / 100;
  const redondeada = Math.round(exacta / 100) * 100;
  return Math.min(total, redondeada > 0 ? redondeada : Math.ceil(exacta));
}
