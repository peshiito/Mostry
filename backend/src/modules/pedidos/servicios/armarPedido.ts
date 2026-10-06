import { AppError } from '../../../shared/errors/AppError.js';

export type ProductoParaPedido = {
  id: number;
  nombre: string;
  precio: number;
  activo: boolean;
  agotado: boolean;
  aceptaEncargo: boolean;
};
export type ItemPedido = { productoId: number; cantidad: number };

// El servidor recalcula SIEMPRE precios y totales (CLAUDE.md 6.1): del
// navegador solo se usan los ids y las cantidades.
export function armarItems(
  tipo: 'inmediato' | 'encargo',
  pedidos: ItemPedido[],
  productos: ProductoParaPedido[],
) {
  const porId = new Map(productos.map((p) => [p.id, p]));
  return pedidos.map(({ productoId, cantidad }) => {
    const p = porId.get(productoId);
    if (!p || !p.activo)
      throw new AppError(
        409,
        'producto_no_disponible',
        'Un producto ya no está disponible.',
        { productoId },
      );
    if (tipo === 'inmediato' && p.agotado)
      throw new AppError(409, 'sin_stock', `"${p.nombre}" está agotado.`, { productoId });
    if (tipo === 'encargo' && !p.aceptaEncargo) {
      throw new AppError(
        409,
        'producto_sin_encargo',
        `"${p.nombre}" no se puede encargar.`,
        { productoId },
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
}
