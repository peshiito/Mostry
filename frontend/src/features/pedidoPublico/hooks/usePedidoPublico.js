import { useConsulta } from '../../../shared/api/useConsulta.js';

// Pedido por token de seguimiento (GET /publico/pedidos/:token). Anda aunque la
// tienda esté cerrada. Los ítems traen nombre y precio copiados al comprar.
export function usePedidoPublico(token) {
  const valido = /^[A-Za-z0-9_-]{43}$/.test(token ?? '');
  const { datos, cargando, error, recargar } = useConsulta(
    valido ? `/publico/pedidos/${token}` : null,
  );
  const pedido = datos
    ? {
        ...datos,
        items: datos.items.map((i, k) => ({ ...i, id: k, precio: i.precioUnitario })),
      }
    : null;
  return { pedido, cargando, error: valido ? error : { status: 404 }, recargar };
}
