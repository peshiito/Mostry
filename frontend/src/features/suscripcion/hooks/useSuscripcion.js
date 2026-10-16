import { useConsulta } from '../../../shared/api/useConsulta.js';
import { usePanel } from '../../panelBase/PanelContexto.jsx';

// Estado del plan (GET /panel/tienda/suscripcion). Suspendida = solo lectura (6.5).
export function useSuscripcion() {
  const { plan } = usePanel();
  // Pagos y días de cortesía registrados por Mostry.
  const pagos = useConsulta('/panel/tienda/suscripcion/pagos');
  return {
    estado: plan.estado,
    diasRestantes: plan.diasRestantes,
    planHasta: plan.venceEl,
    finGracia: plan.finGracia,
    precio: plan.pago.monto,
    aliasMostry: plan.pago.alias,
    titularMostry: plan.pago.titular,
    pagos: pagos.datos ?? [],
    errorPagos: pagos.error,
    recargarPagos: pagos.recargar,
    soloLectura: plan.estado === 'suspendida',
  };
}
