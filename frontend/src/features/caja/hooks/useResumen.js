import { useConsulta } from '../../../shared/api/useConsulta.js';

const fecha = (d) => d.toLocaleDateString('sv-SE');

// Desde/hasta según el período elegido (hoy, últimos 7 días o el mes en curso).
function rango(periodo) {
  const hoy = new Date();
  if (periodo === 'Semana') return [fecha(new Date(Date.now() - 6 * 864e5)), fecha(hoy)];
  if (periodo === 'Mes')
    return [fecha(new Date(hoy.getFullYear(), hoy.getMonth(), 1)), fecha(hoy)];
  return [fecha(hoy), fecha(hoy)];
}

// GET /panel/caja/resumen + historial de cajas. Ventas por día a partir de los ingresos.
export function useResumen(periodo) {
  const [desde, hasta] = rango(periodo);
  const r = useConsulta(`/panel/caja/resumen?desde=${desde}&hasta=${hasta}`);
  const historial = useConsulta('/panel/caja/historial');
  const porDia = {};
  for (const m of r.datos?.movimientos ?? []) {
    if (m.tipo !== 'ingreso') continue;
    const d = fecha(new Date(m.fecha)).slice(8);
    porDia[d] = (porDia[d] ?? 0) + m.monto / 100000;
  }
  return {
    resumen: r.datos,
    porDia,
    cajas: (historial.datos ?? []).filter((c) => c.cerradaEn),
    cargando: r.cargando,
  };
}
