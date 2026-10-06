import { db } from '../../shared/db/db.js';
import type { TiendaId } from '../../shared/db/tiendaId.js';
import { idInsertado } from '../../shared/db/idInsertado.js';
import { AppError } from '../../shared/errors/AppError.js';
import { registrarMovimiento } from '../caja/servicios/registrarMovimiento.js';
import { clientesRepo } from './clientes.repository.js';
import { clienteNoEncontrado, verCliente } from './verCliente.js';
import type { MovimientoFiado } from './libreta.schemas.js';

// Deuda: solo se anota. Pago: se anota y entra a caja en la misma transacción
// (decisión 38). No se puede cobrar más de lo que debe.
export async function registrarFiado(
  tiendaId: TiendaId,
  clienteId: number,
  m: MovimientoFiado,
) {
  await db.transaction().execute(async (tx) => {
    const cliente = await clientesRepo.buscar(tiendaId, clienteId, tx);
    if (!cliente) throw clienteNoEncontrado();
    // Desactivado: no se le anota más deuda, pero sí puede saldar lo que debe.
    if (!cliente.activo && m.tipo === 'deuda') {
      throw new AppError(
        409,
        'cliente_inactivo',
        'Ese cliente está desactivado: reactivalo para anotarle deuda.',
      );
    }
    const saldo = Number(cliente.saldo);
    if (m.tipo === 'pago' && m.monto > saldo) {
      throw new AppError(
        409,
        'pago_mayor_que_deuda',
        'El pago es mayor que lo que debe.',
        { saldo },
      );
    }
    const fila = {
      tiendaId,
      clienteId,
      tipo: m.tipo,
      monto: m.monto,
      detalle: m.detalle ?? null,
      fecha: new Date(),
    };
    const movimientoId = idInsertado(
      await tx.insertInto('movimientosFiado').values(fila).executeTakeFirstOrThrow(),
    );
    if (m.tipo === 'pago') {
      const concepto = `Pago de fiado: ${cliente.nombre}`.slice(0, 150);
      await registrarMovimiento(tx, tiendaId, {
        tipo: 'ingreso',
        medio: m.medio!,
        monto: m.monto,
        concepto,
        origen: 'fiado',
        origenId: movimientoId, // el pago puntual, no el cliente
      });
    }
  });
  return verCliente(tiendaId, clienteId);
}
