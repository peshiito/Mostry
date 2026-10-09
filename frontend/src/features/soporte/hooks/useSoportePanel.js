import { useAccion } from '../../../shared/api/useAccion.js';
import { useConsulta } from '../../../shared/api/useConsulta.js';
import { panel } from '../../panelBase/panelApi.js';

// Permiso de soporte del comercio: verlo, darlo por 1 hora y cortarlo.
export function useSoportePanel() {
  const c = useConsulta('/panel/soporte');
  const accion = useAccion(
    async (dar) => {
      const r = await (dar
        ? panel.post('/soporte/acceso')
        : panel.borrar('/soporte/acceso'));
      c.setDatos(r);
    },
    {
      exito: (_, dar) =>
        dar ? 'Le diste acceso a Mostry por 1 hora' : 'Cortaste el acceso',
    },
  );
  return {
    acceso: c.datos?.acceso ?? null,
    registro: c.datos?.registro ?? [],
    cargando: c.cargando,
    error: c.error,
    recargar: c.recargar,
    accion,
    dar: () => accion.ejecutar(true),
    cortar: () => accion.ejecutar(false),
  };
}
