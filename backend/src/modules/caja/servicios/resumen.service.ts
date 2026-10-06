import { db } from '../../../shared/db/db.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { inicioDiaAr } from '../../../shared/utils/horaArgentina.js';
import { movimientosRepo } from '../repositorios/movimientos.repository.js';
import { totales } from './cuentas.js';

const DIA_MS = 24 * 60 * 60 * 1000;

async function gastosPorTipo(tiendaId: TiendaId, desde: Date, hasta: Date) {
  const filas = await db
    .selectFrom('gastos')
    .select(['tipo', (eb) => eb.fn.sum<number>('monto').as('total')])
    .where('tiendaId', '=', tiendaId)
    .where('fecha', '>=', desde)
    .where('fecha', '<', hasta)
    .groupBy('tipo')
    .execute();
  const de = (tipo: string) => Number(filas.find((f) => f.tipo === tipo)?.total ?? 0);
  return { gastos: de('gasto'), inversiones: de('inversion') };
}

// Resumen de un período en días argentinos ('YYYY-MM-DD', ambos incluidos).
// Ganancia real = ingresos − devoluciones de pedidos − gastos. Las inversiones
// se muestran aparte (decisión 37). Una venta devuelta no es ganancia.
export async function resumenPeriodo(tiendaId: TiendaId, desde: string, hasta: string) {
  const inicio = inicioDiaAr(desde);
  const fin = new Date(inicioDiaAr(hasta).getTime() + DIA_MS);
  const [movimientos, gastos] = await Promise.all([
    movimientosRepo.entre(tiendaId, inicio, fin),
    gastosPorTipo(tiendaId, inicio, fin),
  ]);
  const t = totales(movimientos);
  const devoluciones = movimientos
    .filter((m) => m.tipo === 'egreso' && m.origen === 'pedido')
    .reduce((suma, m) => suma + m.monto, 0);
  const gananciaReal = t.ingresos - devoluciones - gastos.gastos;
  return { desde, hasta, ...t, ...gastos, devoluciones, gananciaReal, movimientos };
}
