import { useAccion } from '../../../shared/api/useAccion.js';
import { useConsulta } from '../../../shared/api/useConsulta.js';
import { panel } from '../../panelBase/panelApi.js';

const hora = (iso) =>
  new Date(iso).toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

// Caja de hoy (GET /panel/caja: null si todavía no se abrió) y las transferencias
// del día, que entran aunque la caja esté cerrada (6.4).

const MENSAJES_CAJA = {
  abrir: 'Caja abierta',
  cerrar: 'Caja cerrada',
  movimientos: 'Movimiento anotado',
};
export function useCaja() {
  const caja = useConsulta('/panel/caja');
  const resumen = useConsulta('/panel/caja/resumen');
  const accion = useAccion(
    async (ruta, cuerpo) => {
      const r = await panel.post(`/caja/${ruta}`, cuerpo);
      caja.recargar();
      resumen.recargar();
      return r;
    },
    { exito: (_, ruta) => MENSAJES_CAJA[ruta] ?? 'Listo' },
  );
  const c = caja.datos;
  const movs = (c?.movimientos ?? resumen.datos?.movimientos ?? []).map((m) => ({
    ...m,
    hora: hora(m.fecha),
  }));
  const datos = {
    abierta: !!c && !c.cerradaEn,
    cerrada: !!c?.cerradaEn,
    apertura: c?.montoApertura ?? 0,
    ingresosEfectivo: c?.totales.ingresosEfectivo ?? 0,
    egresosEfectivo: movs
      .filter((m) => m.medio === 'efectivo' && m.tipo === 'egreso')
      .reduce((s, m) => s + m.monto, 0),
    depositos: c?.totales.depositos ?? 0,
    diferencia: c?.diferencia,
    movimientos: c ? movs : movs.filter((m) => m.medio === 'transferencia'),
  };
  return {
    caja: datos,
    esperado: c?.esperado ?? 0,
    cargando: caja.cargando,
    abrir: (montoApertura) => accion.ejecutar('abrir', { montoApertura }),
    cerrar: (montoContado) => accion.ejecutar('cerrar', { montoContado }),
    registrar: (m) =>
      accion.ejecutar('movimientos', {
        tipo: m.tipo,
        medio: m.medio,
        monto: m.monto,
        concepto: m.concepto,
      }),
    accion,
  };
}
