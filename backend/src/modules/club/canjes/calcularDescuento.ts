type Premio = {
  tipo: 'porcentaje' | 'monto' | 'regalo';
  valor: number | null;
  tope: number | null;
};

// El descuento de un premio sobre los productos (nunca sobre el envío), en
// centavos. Lo calcula SIEMPRE el servidor: nunca se confía en el navegador.
// Porcentaje: redondeado al peso y con tope; monto: hasta el subtotal; regalo: 0.
export function calcularDescuento(p: Premio, subtotal: number) {
  if (p.tipo === 'regalo' || !p.valor) return 0;
  if (p.tipo === 'monto') return Math.min(p.valor, subtotal);
  const exacto = Math.round((subtotal * p.valor) / 100 / 100) * 100;
  return Math.min(exacto, p.tope ?? Infinity, subtotal);
}
