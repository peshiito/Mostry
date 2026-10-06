import type { Selectable } from 'kysely';
import type { ProductosTabla } from '../../../shared/db/tipos/catalogo.js';

// Agrega lo que el panel necesita y no se guarda: disponible y alerta de stock.
export function conDisponible(p: Selectable<ProductosTabla>) {
  const { tiendaId, ...resto } = p;
  return {
    ...resto,
    stockDisponible: p.stock - p.stockReservado,
    stockBajo: p.stockMinimo > 0 && p.stock <= p.stockMinimo,
  };
}
