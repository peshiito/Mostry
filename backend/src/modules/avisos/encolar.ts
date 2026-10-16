import type { Ejecutor } from '../../shared/db/ejecutor.js';
import type { TiendaId } from '../../shared/db/tiendaId.js';
import type { TipoAviso } from '../../shared/db/tipos/avisos.js';

// Anota QUÉ avisar, dentro de la transacción de quien llama: si el pedido se
// deshace, el aviso también. La clave única por tienda evita duplicados.
export const encolarAviso = (
  tx: Ejecutor,
  tiendaId: TiendaId,
  a: { tipo: TipoAviso; pedidoId: number | null; clave: string },
) =>
  tx
    .insertInto('avisosPush')
    .ignore()
    .values({ tiendaId, ...a })
    .execute();

// Pedido o encargo nuevo de la tienda online.
export const avisoDePedido = (tipo: 'inmediato' | 'encargo', pedidoId: number) => {
  const t = tipo === 'encargo' ? ('encargo_nuevo' as const) : ('pedido_nuevo' as const);
  return { tipo: t, pedidoId, clave: `${t}:${pedidoId}` };
};
