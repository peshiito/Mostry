import { db } from '../../shared/db/db.js';
import type { TiendaId } from '../../shared/db/tiendaId.js';
import { AppError } from '../../shared/errors/AppError.js';
import { inicioDiaAr } from '../../shared/utils/horaArgentina.js';
import { registrarMovimiento } from '../caja/servicios/registrarMovimiento.js';
import type { DatosGasto } from './gastos.schemas.js';
import { gastosRepo } from './gastos.repository.js';
import { proveedoresRepo } from './proveedores.repository.js';

const DIA_MS = 24 * 60 * 60 * 1000;

// Un gasto o inversión genera su egreso en caja en la MISMA transacción (6.4):
// si es en efectivo y la caja está cerrada, no se registra ninguno de los dos.
export async function registrarGasto(tiendaId: TiendaId, d: DatosGasto) {
  const id = await db.transaction().execute(async (tx) => {
    const proveedor = d.proveedorId
      ? await proveedoresRepo.buscarActivo(tiendaId, d.proveedorId, tx)
      : null;
    if (d.proveedorId && !proveedor)
      throw new AppError(400, 'proveedor_invalido', 'Ese proveedor no existe.');
    const fila = {
      tiendaId,
      tipo: d.tipo,
      monto: d.monto,
      medio: d.medio,
      proveedorId: d.proveedorId ?? null,
      detalle: d.detalle ?? null,
      fecha: new Date(),
    };
    const gastoId = await gastosRepo.insertar(tx, fila);
    const quien = proveedor ? ` a ${proveedor.nombre}` : '';
    const concepto =
      `${d.tipo === 'inversion' ? 'Inversión' : 'Gasto'}${quien}${d.detalle ? `: ${d.detalle}` : ''}`.slice(
        0,
        150,
      );
    await registrarMovimiento(tx, tiendaId, {
      tipo: 'egreso',
      medio: d.medio,
      monto: d.monto,
      concepto,
      origen: 'gasto',
      origenId: gastoId,
    });
    return gastoId;
  });
  return { id, ...d };
}

export function listarGastos(
  tiendaId: TiendaId,
  desde: string,
  hasta: string,
  tipo?: 'gasto' | 'inversion',
) {
  if (desde > hasta)
    throw new AppError(
      400,
      'periodo_invalido',
      '"desde" no puede ser posterior a "hasta".',
    );
  return gastosRepo.listar(tiendaId, {
    desde: inicioDiaAr(desde),
    hasta: new Date(inicioDiaAr(hasta).getTime() + DIA_MS),
    tipo,
  });
}
