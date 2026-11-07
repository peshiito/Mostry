import { useConsulta } from '../../../shared/api/useConsulta.js';
import { useAccion } from '../../../shared/api/useAccion.js';
import { useBasePanel, usePanelApi } from '../../panelBase/BasePanel.jsx';

// Las últimas publicaciones (para volver a una) y "volver a la de siempre".
// Solo se piden con la hoja abierta.
export function useVersiones(abierta, { alRestaurar, alVolver }) {
  const panel = usePanelApi();
  const { api } = useBasePanel();
  const lista = useConsulta(abierta ? `${api}/tienda/pagina/versiones` : null);
  const restaurar = useAccion(
    async (id) => {
      const { borrador } = await panel.post(`/tienda/pagina/versiones/${id}/restaurar`);
      alRestaurar(borrador);
    },
    { exito: 'Listo: la versión quedó en el borrador. Publicala para que se vea.' },
  );
  const deSiempre = useAccion(
    async () => {
      await panel.borrar('/tienda/pagina');
      alVolver();
    },
    { exito: 'Tu tienda volvió a la página de siempre' },
  );
  return { lista, restaurar, deSiempre };
}
