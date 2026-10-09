import { db } from '../../../shared/db/db.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import type { EstadoPedido } from '../../../shared/db/tipos/pedidos.js';
import type { Medio } from '../../../shared/db/tipos/caja.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { registrarMovimiento } from '../../caja/servicios/registrarMovimiento.js';
import { pedidosRepo, type Pedido } from '../repositorios/pedidos.repository.js';
import { TRANSICIONES_MANUALES, type EstadoManual } from './estados.js';
import { restoACobrar } from './montos.js';
import { pedidoNoEncontrado, verPedido } from './panelPedidos.service.js';

const invalida = (desde: EstadoPedido, hacia: EstadoPedido) =>
  new AppError(
    409,
    'transicion_invalida',
    'El pedido no puede pasar a ese estado ahora.',
    { desde, hacia },
  );

function validar(p: Pedido, hacia: EstadoManual) {
  if (!TRANSICIONES_MANUALES[hacia].includes(p.estado)) throw invalida(p.estado, hacia);
  if (
    (hacia === 'en_camino' && p.entrega !== 'envio') ||
    (hacia === 'listo_retirar' && p.entrega !== 'retiro')
  ) {
    throw invalida(p.estado, hacia);
  }
}

// El comerciante avanza el pedido un paso (con el pedido bloqueado: sin carreras).
// Al entregar un encargo, el resto se cobra y entra a la caja en ese momento (6.2).
export async function avanzarPedido(
  tiendaId: TiendaId,
  id: number,
  hacia: EstadoManual,
  medioCobro?: Medio,
) {
  await db.transaction().execute(async (tx) => {
    const p = await pedidosRepo.bloquear(tx, tiendaId, id);
    if (!p) throw pedidoNoEncontrado();
    validar(p, hacia);
    const resto = restoACobrar(p);
    if (hacia === 'entregado' && p.tipo === 'encargo' && resto > 0) {
      if (!medioCobro)
        throw new AppError(
          409,
          'falta_cobrar',
          'Indicá cómo cobraste el resto del encargo.',
          { resto },
        );
      const concepto = `Resto del encargo #${p.numero}`;
      await registrarMovimiento(tx, tiendaId, {
        tipo: 'ingreso',
        medio: medioCobro,
        monto: resto,
        concepto,
        origen: 'pedido',
        origenId: p.id,
      });
    }
    await tx
      .updateTable('pedidos')
      .set({ estado: hacia, ...(hacia === 'entregado' && { entregadoEn: new Date() }) })
      .where('tiendaId', '=', tiendaId)
      .where('id', '=', id)
      .execute();
  });
  return verPedido(tiendaId, id);
}
