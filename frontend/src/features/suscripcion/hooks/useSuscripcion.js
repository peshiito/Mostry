import { usePanel } from '../../panelBase/PanelContexto.jsx';

// Estado del plan (GET /panel/tienda/suscripcion). Suspendida = solo lectura (6.5).
export function useSuscripcion() {
  const { plan } = usePanel();
  return {
    estado: plan.estado,
    diasRestantes: plan.diasRestantes,
    planHasta: plan.venceEl,
    finGracia: plan.finGracia,
    precio: plan.pago.monto,
    aliasMostry: plan.pago.alias,
    titularMostry: plan.pago.titular,
    pagos: [],
    soloLectura: plan.estado === 'suspendida',
  };
}
