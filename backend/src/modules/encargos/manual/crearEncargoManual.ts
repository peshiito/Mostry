import { db } from '../../../shared/db/db.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { registrarMovimiento } from '../../caja/servicios/registrarMovimiento.js';
import { MAX_DIAS_ENCARGO } from '../../horarios/servicios/fechaEncargo.js';
import { checkoutRepo as repo } from '../../pedidos/repositorios/checkout.repository.js';
import { tiendaParaPedido } from '../../pedidos/repositorios/tiendaParaPedido.repository.js';
import { armarItems } from '../../pedidos/servicios/armarPedido.js';
import { verPedido } from '../../pedidos/servicios/panelPedidos.service.js';
import type { DatosEncargoManual } from './esquema.js';
import { filaManual, montosManual } from './filaManual.js';

const DIA_MS = 24 * 60 * 60 * 1000;

// El comerciante manda: sin anticipación, horario ni cupo. Solo una fecha
// futura y dentro de lo que se puede encargar.
function validarFecha(fecha: Date, ahora: Date) {
  const t = fecha.getTime();
  if (t <= ahora.getTime() || t > ahora.getTime() + MAX_DIAS_ENCARGO * DIA_MS)
    throw new AppError(
      400,
      'fecha_encargo_invalida',
      'Elegí una fecha de los próximos 60 días.',
    );
}

// Encargos 3: crea el encargo ya aceptado. Si ya cobró la seña, entra a la caja
// en la misma transacción (efectivo con la caja de hoy abierta). No toca stock.
export async function crearEncargoManual(
  tiendaId: TiendaId,
  d: DatosEncargoManual,
  ahora = new Date(),
) {
  validarFecha(d.fechaEncargo, ahora);
  const t = await tiendaParaPedido(tiendaId);
  const id = await db.transaction().execute(async (tx) => {
    const numero = await repo.siguienteNumero(tx, tiendaId);
    const ids = d.items.map((i) => i.productoId);
    const items = armarItems(
      'encargo',
      d.items,
      await repo.productos(tx, tiendaId, ids),
      true,
    );
    const montos = montosManual(items, d, t.costoEnvio);
    const fila = filaManual(tiendaId, numero, d, montos);
    const pedidoId = await repo.insertar(
      tx,
      fila,
      items.map((i) => ({ ...i, tiendaId })),
    );
    if (d.sena)
      await registrarMovimiento(tx, tiendaId, {
        tipo: 'ingreso',
        medio: d.sena.medio,
        monto: montos.sena,
        concepto: `Seña del encargo #${numero}`,
        origen: 'pedido',
        origenId: pedidoId,
      });
    return pedidoId;
  });
  return verPedido(tiendaId, id);
}
