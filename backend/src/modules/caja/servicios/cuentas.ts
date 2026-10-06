import type { Movimiento } from '../repositorios/movimientos.repository.js';

// Efectivo que tendría que haber en la caja (sección 6.4):
// apertura + ingresos en efectivo − egresos en efectivo − depósitos.
export function efectivoEsperado(apertura: number, movimientos: Movimiento[]): number {
  let total = apertura;
  for (const m of movimientos) {
    if (m.medio !== 'efectivo') continue;
    if (m.tipo === 'ingreso') total += m.monto;
    else total -= m.monto; // egreso o depósito (el efectivo sale de la caja)
  }
  return total;
}

// Sumas de un período por tipo y por medio.
export function totales(movimientos: Movimiento[]) {
  const t = {
    ingresos: 0,
    egresos: 0,
    depositos: 0,
    ingresosEfectivo: 0,
    ingresosTransferencia: 0,
  };
  for (const m of movimientos) {
    if (m.tipo === 'ingreso') {
      t.ingresos += m.monto;
      if (m.medio === 'efectivo') t.ingresosEfectivo += m.monto;
      else t.ingresosTransferencia += m.monto;
    } else if (m.tipo === 'egreso') t.egresos += m.monto;
    else t.depositos += m.monto;
  }
  return t;
}
