import type { EstadoTienda } from '../../../shared/db/tipos/tiendas.js';
import { estadoEfectivo } from '../../tiendas/servicios/estadoSuscripcion.js';
import { metricasRepo } from '../repositorios/metricas.repository.js';

const haceDias = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

// Primer día del mes actual en hora argentina, como 'YYYY-MM-DD'.
const inicioDelMes = () =>
  `${new Date().toLocaleDateString('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' }).slice(0, 7)}-01`;

export async function metricas() {
  const ahora = new Date();
  const porEstado: Record<EstadoTienda, number> = {
    prueba: 0,
    activa: 0,
    gracia: 0,
    suspendida: 0,
  };
  const fechas = await metricasRepo.fechasDeTodas();
  for (const t of fechas) porEstado[estadoEfectivo(t, ahora)]++;

  const desde = inicioDelMes();
  const [nuevas30d, pedidos30d, activas, eliminadas, club] = await Promise.all([
    metricasRepo.tiendasNuevas(haceDias(30)),
    metricasRepo.pedidosDesde(haceDias(30)),
    metricasRepo.cobradoDesde(desde),
    metricasRepo.eliminadas(),
    metricasRepo.club(),
  ]);
  const deEliminadas = eliminadas.flatMap((e) => e.pagos).filter((p) => p.fecha >= desde);
  const cobradoMes = {
    total: activas.total + deEliminadas.reduce((s, p) => s + p.monto, 0),
    pagos: activas.pagos + deEliminadas.length,
  };
  return {
    tiendas: {
      total: fechas.length,
      porEstado,
      nuevas30d,
      eliminadas: eliminadas.length,
    },
    pedidos30d,
    cobradoMes,
    club,
  };
}
