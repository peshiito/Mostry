import { db } from '../../../shared/db/db.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import type { Medio } from '../../../shared/db/tipos/caja.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { registrarMovimiento } from '../../caja/servicios/registrarMovimiento.js';
import { pedidosRepo } from '../repositorios/pedidos.repository.js';
import { cancelarEnTx } from './cancelar.js';
import { montoAPagar } from './montos.js';
import { pedidoNoEncontrado, verPedido } from './panelPedidos.service.js';

// Cancela desde el panel. Si ya había pagado y el comerciante le devolvió la
// plata, queda el egreso en caja (decisión 26). El ingreso original no se toca.
// Todo o nada: si la devolución no se puede registrar, el pedido NO se cancela.
export async function cancelarPedido(
  tiendaId: TiendaId,
  id: number,
  motivo: string,
  devolucion?: { medio: Medio },
) {
  const resultado = await db.transaction().execute(async (tx) => {
    const p = await pedidosRepo.bloquear(tx, tiendaId, id);
    if (!p) throw pedidoNoEncontrado();
    const { habiaPago } = await cancelarEnTx(tx, tiendaId, p, motivo);
    if (!devolucion) return { habiaPago, devuelto: 0 };
    if (!habiaPago)
      throw new AppError(
        409,
        'sin_pago_para_devolver',
        'Ese pedido no tenía pagos aprobados: no hay nada que devolver.',
      );
    // El monto aprobado siempre es montoAPagar (la aprobación lo exige).
    const monto = montoAPagar(p);
    const concepto = `Devolución del pedido #${p.numero}`;
    try {
      await registrarMovimiento(tx, tiendaId, {
        tipo: 'egreso',
        medio: devolucion.medio,
        monto,
        concepto,
        origen: 'pedido',
        origenId: p.id,
      });
    } catch (err) {
      if (err instanceof AppError && err.codigo === 'caja_cerrada') {
        throw new AppError(
          409,
          'caja_cerrada',
          'Para devolver en efectivo abrí la caja de hoy. El pedido NO se canceló.',
        );
      }
      throw err;
    }
    return { habiaPago, devuelto: monto };
  });
  return { ...(await verPedido(tiendaId, id)), ...resultado };
}
