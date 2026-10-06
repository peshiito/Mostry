import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { pedidosRepo } from '../repositorios/pedidos.repository.js';
import { tiendaParaPedido } from '../repositorios/tiendaParaPedido.repository.js';
import { montoAPagar } from './montos.js';

// Lo que ve el comprador con su link único: solo SU pedido.
export async function verSeguimiento(tiendaId: TiendaId, token: string) {
  const p = await pedidosRepo.porToken(tiendaId, token);
  if (!p) throw new AppError(404, 'pedido_no_encontrado', 'No encontramos ese pedido.');
  const [items, t] = await Promise.all([
    pedidosRepo.items(tiendaId, p.id),
    tiendaParaPedido(tiendaId),
  ]);
  return {
    numero: p.numero,
    estado: p.estado,
    tipo: p.tipo,
    entrega: p.entrega,
    direccion: p.direccion,
    fechaEncargo: p.fechaEncargo,
    items: items.map(({ productoId: _id, ...i }) => i),
    subtotal: p.subtotal,
    costoEnvio: p.costoEnvio,
    total: p.total,
    sena: p.sena,
    venceComprobanteEn: p.venceComprobanteEn,
    creadoEn: p.creadoEn,
    tienda: { nombre: t.nombre, whatsapp: t.whatsapp },
    pago:
      p.estado === 'pendiente_pago'
        ? { alias: t.alias, titular: t.titularAlias, monto: montoAPagar(p) }
        : null,
  };
}
