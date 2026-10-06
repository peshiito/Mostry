import { aCentavos } from '../../../shared/lib/plata.js';

// Datos del pago que carga el comerciante al aprobar (6.1).
// El monto tiene que ser exactamente el que se pidió (decisión de la Etapa 4).
export function validarAprobacion(d, montoEsperado) {
  const e = {};
  const monto = aCentavos(d.monto);
  if (monto === null) e.monto = 'Escribí el monto que te llegó.';
  else if (monto !== montoEsperado) e.monto = 'No coincide con lo que había que pagar.';
  if (!d.fecha) e.fecha = 'Poné la fecha de la transferencia.';
  if (d.titular.trim().length < 3) e.titular = 'Escribí quién hizo la transferencia.';
  if (!/^[\w-]{4,40}$/.test(d.operacion.trim()))
    e.operacion = 'Copiá el número de operación.';
  return e;
}
