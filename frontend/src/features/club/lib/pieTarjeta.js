import { plata } from '../../../shared/lib/plata.js';
import { textoVence } from './textoPremio.js';

// La letra chica de la tarjeta: compra mínima y vencimiento, si hay.
export function pieTarjeta(p) {
  const partes = [
    p.compraMinima ? `Suman las compras desde ${plata(p.compraMinima)}` : null,
    textoVence(p.venceMeses),
  ].filter(Boolean);
  return partes.length ? `${partes.join('. ')}.` : null;
}
