import type { Ejecutor } from '../../../shared/db/ejecutor.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import type { MovimientosCajaTabla } from '../../../shared/db/tipos/caja.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { enArgentina } from '../../../shared/utils/horaArgentina.js';
import { cajasRepo } from '../repositorios/cajas.repository.js';
import { movimientosRepo } from '../repositorios/movimientos.repository.js';

export type NuevoMovimiento = Pick<
  MovimientosCajaTabla,
  'tipo' | 'medio' | 'monto' | 'concepto' | 'origen'
> & {
  origenId?: number | null;
  // Solo transferencias: la fecha de la operación (6.4). El efectivo es "ahora".
  fecha?: Date;
};

// Único punto por donde entra o sale plata (pedidos, fiados, gastos, manual).
// Va dentro de la transacción de quien llama: si algo falla, no queda el movimiento.
// - Efectivo: exige la caja de HOY abierta (decisión 36).
// - Transferencia: entra con su fecha aunque la caja esté cerrada (sección 6.4).
export async function registrarMovimiento(
  tx: Ejecutor,
  tiendaId: TiendaId,
  m: NuevoMovimiento,
) {
  if (!Number.isInteger(m.monto) || m.monto <= 0)
    throw new Error(`Monto inválido en caja: ${m.monto}`);
  if (m.tipo === 'deposito' && m.medio !== 'efectivo') {
    throw new AppError(
      400,
      'deposito_invalido',
      'Un depósito es efectivo que sale de la caja al banco.',
    );
  }
  // FOR UPDATE: un cierre de caja y un cobro simultáneos no se pisan.
  const caja = await cajasRepo.abierta(tiendaId, tx);
  const deHoy = caja && caja.fecha === enArgentina(new Date()).fecha ? caja : undefined;
  if (m.medio === 'efectivo' && !deHoy) {
    throw new AppError(
      409,
      'caja_cerrada',
      'Abrí la caja de hoy para registrar efectivo.',
    );
  }
  await movimientosRepo.insertar(tx, {
    tiendaId,
    cajaId: deHoy?.id ?? null,
    tipo: m.tipo,
    medio: m.medio,
    monto: m.monto,
    concepto: m.concepto,
    origen: m.origen,
    origenId: m.origenId ?? null,
    fecha: m.medio === 'transferencia' && m.fecha ? m.fecha : new Date(),
  });
}
