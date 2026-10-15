import { plata } from '../../../shared/lib/plata.js';

// Un premio en palabras, igual en el panel, la vidriera y la app del Club.
export function textoPremio(p) {
  if (p.tipo === 'regalo') return `De regalo: ${p.descripcion}`;
  if (p.tipo === 'monto') return `${plata(p.valor)} de descuento`;
  const tope = p.tope ? ` (hasta ${plata(p.tope)})` : '';
  return `${p.valor} % de descuento${tope}`;
}

export const textoCompras = (n) => (n === 1 ? '1 compra' : `${n} compras`);

// "Sellos que duran 6 meses" / "Los sellos no vencen".
export const textoVence = (meses) =>
  meses ? `Los sellos duran ${meses === 1 ? '1 mes' : `${meses} meses`}` : null;
