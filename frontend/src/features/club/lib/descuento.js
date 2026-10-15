// El mismo cálculo que hace el servidor (club/canjes/calcularDescuento.ts),
// solo para mostrar el total: el servidor lo recalcula y, si no coincide,
// avisa con los montos correctos.
export function calcularDescuento(p, subtotal) {
  if (!p || p.tipo === 'regalo' || !p.valor) return 0;
  if (p.tipo === 'monto') return Math.min(p.valor, subtotal);
  const exacto = Math.round((subtotal * p.valor) / 100 / 100) * 100;
  return Math.min(exacto, p.tope ?? Infinity, subtotal);
}

// Los premios que ya puede usar con sus sellos.
export const disponibles = (premios, sellos) =>
  premios.filter((p) => sellos >= p.compras);
