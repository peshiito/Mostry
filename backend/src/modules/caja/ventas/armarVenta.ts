import { AppError } from '../../../shared/errors/AppError.js';
import type { DatosVenta } from './schemas.js';

type Producto = { id: number; nombre: string; precio: number; activo: boolean };
type Item = {
  productoId: number | null;
  nombre: string;
  precioUnitario: number;
  cantidad: number;
  subtotal: number;
};

// Ítems con el precio del servidor; el monto suelto es un ítem sin producto.
export function armarVenta(d: DatosVenta, productos: Producto[]) {
  const porId = new Map(productos.map((p) => [p.id, p]));
  const items: Item[] = d.items.map(({ productoId, cantidad }) => {
    const p = porId.get(productoId);
    if (!p || !p.activo) {
      throw new AppError(
        409,
        'producto_no_disponible',
        'Un producto ya no está a la venta.',
        {
          productoId,
        },
      );
    }
    return {
      productoId,
      nombre: p.nombre,
      precioUnitario: p.precio,
      cantidad,
      subtotal: p.precio * cantidad,
    };
  });
  if (d.suelto) {
    const { monto, concepto } = d.suelto;
    items.push({
      productoId: null,
      nombre: concepto || 'Monto suelto',
      precioUnitario: monto,
      cantidad: 1,
      subtotal: monto,
    });
  }
  return { items, total: items.reduce((s, i) => s + i.subtotal, 0) };
}
