import type { ModoStock } from '../../../shared/db/tipos/catalogo.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { personalizacionDelItem } from './personalizacion.js';

export type ProductoParaPedido = {
  id: number;
  nombre: string;
  precio: number;
  activo: boolean;
  agotado: boolean;
  aceptaEncargo: boolean;
  modoStock: ModoStock;
  pidePersonalizacion: boolean;
};
export type ItemPedido = {
  productoId: number;
  cantidad: number;
  personalizacion?: string;
};

// El servidor recalcula SIEMPRE precios y totales (CLAUDE.md 6.1): del
// navegador solo se usan los ids y las cantidades.
export function armarItems(
  tipo: 'inmediato' | 'encargo',
  pedidos: ItemPedido[],
  productos: ProductoParaPedido[],
  manual = false, // encargo cargado desde el panel (Encargos 3)
) {
  const porId = new Map(productos.map((p) => [p.id, p]));
  return pedidos.map(({ productoId, cantidad, personalizacion }) => {
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
    if (tipo === 'inmediato' && p.modoStock === 'a_pedido')
      throw new AppError(
        409,
        'solo_encargo',
        `"${p.nombre}" se hace a pedido: encargalo.`,
        {
          productoId,
        },
      );
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
      personalizacion: personalizacionDelItem(tipo, p, personalizacion, manual),
      // Solo lo que se cuenta por unidades reserva stock (y solo al comprar al toque).
      reservo: tipo === 'inmediato' && p.modoStock === 'unidades',
    };
  });
}
