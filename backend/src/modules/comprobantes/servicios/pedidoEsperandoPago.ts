import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { pedidosRepo } from '../../pedidos/repositorios/pedidos.repository.js';

export const plazoVencido = () =>
  new AppError(409, 'plazo_vencido', 'Se venció el plazo para pagar este pedido.');

// Chequeo previo (sin lock) antes de procesar y subir el archivo.
export async function pedidoEsperandoPago(tiendaId: TiendaId, token: string) {
  const pedido = await pedidosRepo.porToken(tiendaId, token);
  if (!pedido)
    throw new AppError(404, 'pedido_no_encontrado', 'No encontramos ese pedido.');
  if (pedido.estado !== 'pendiente_pago') {
    throw new AppError(
      409,
      'pedido_sin_pago_pendiente',
      'Este pedido no está esperando un comprobante.',
    );
  }
  if (pedido.venceComprobanteEn && pedido.venceComprobanteEn <= new Date())
    throw plazoVencido();
  return pedido;
}
