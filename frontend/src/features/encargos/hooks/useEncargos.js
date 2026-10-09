import { useAccion } from '../../../shared/api/useAccion.js';
import { useConsulta } from '../../../shared/api/useConsulta.js';
import { panel } from '../../panelBase/panelApi.js';

const dia = (iso) => new Date(iso).toLocaleDateString('sv-SE');
const enDias = (n) => new Date(Date.now() + n * 864e5).toLocaleDateString('sv-SE');

// Encargos de los próximos 7 días (GET /panel/encargos), agrupados por día.
export function useEncargos() {
  const {
    datos,
    cargando,
    error: errorCarga,
    recargar,
  } = useConsulta(`/panel/encargos?desde=${enDias(0)}&hasta=${enDias(6)}`);
  const encargos = (datos ?? []).map((e) => ({
    ...e,
    fecha: e.fechaEncargo,
    cliente: e.clienteNombre,
    detalle: e.items.map((i) => `${i.nombre} ×${i.cantidad}`).join(', '),
  }));
  const accion = useAccion(
    async (id, estado) => {
      await panel.post(`/pedidos/${id}/estado`, { estado });
      recargar();
    },
    { exito: 'Encargo actualizado' },
  );
  return {
    delDia: (d) => encargos.filter((e) => dia(e.fecha) === d),
    conEncargos: new Set(encargos.map((e) => dia(e.fecha))),
    cambiar: accion.ejecutar,
    cargando,
    errorCarga,
    recargar,
    error: accion.error,
  };
}
