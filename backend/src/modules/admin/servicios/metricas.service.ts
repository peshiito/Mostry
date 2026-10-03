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

  const [nuevas30d, pedidos30d, cobradoMes] = await Promise.all([
    metricasRepo.tiendasNuevas(haceDias(30)),
    metricasRepo.pedidosDesde(haceDias(30)),
    metricasRepo.cobradoDesde(inicioDelMes()),
  ]);
  return {
    tiendas: { total: fechas.length, porEstado, nuevas30d },
    pedidos30d,
    cobradoMes,
  };
}
