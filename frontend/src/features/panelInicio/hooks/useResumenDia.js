import { useConsulta } from '../../../shared/api/useConsulta.js';
import { usePanel } from '../../panelBase/PanelContexto.jsx';

const dia = (desplazamiento) =>
  new Date(Date.now() + desplazamiento * 864e5).toLocaleDateString('sv-SE');

// Resumen del día: caja de hoy, pedidos por aprobar, encargos de mañana y stock bajo.
export function useResumenDia() {
  const { tienda } = usePanel();
  const resumen = useConsulta('/panel/caja/resumen');
  const caja = useConsulta('/panel/caja');
  const porAprobar = useConsulta('/panel/pedidos?estado=comprobante_enviado');
  const manana = useConsulta(`/panel/encargos?desde=${dia(1)}&hasta=${dia(1)}`);
  const bajo = useConsulta('/panel/productos?stockBajo=true');
  const r = resumen.datos;
  const consultas = [resumen, caja, porAprobar, manana, bajo];
  return {
    cargando: consultas.some((c) => c.cargando),
    error: consultas.find((c) => c.error)?.error ?? null,
    nombreDuena: tienda.nombre,
    ventasHoy: r?.ingresos ?? 0,
    pedidosHoy: (r?.movimientos ?? []).filter((m) => m.origen === 'pedido').length,
    porAprobar: porAprobar.datos?.total ?? 0,
    encargosManana: manana.datos?.length ?? 0,
    cajaAbierta: !!caja.datos && !caja.datos.cerradaEn,
    stockBajo: (bajo.datos?.productos ?? []).map((p) => ({
      ...p,
      stock: p.stockDisponible,
      foto: '/sin-foto.svg',
    })),
  };
}
