import { useAccion } from '../../../shared/api/useAccion.js';

import { usePanel } from '../../panelBase/PanelContexto.jsx';
import { usePanelApi } from '../../panelBase/BasePanel.jsx';

// Cambios que se aplican al toque: pausar la tienda, logo y alias de cobro (pide la contraseña).
export function useAjustesRapidos() {
  const panel = usePanelApi();
  const { tienda, setTienda, recargarTienda } = usePanel();
  const pausa = useAccion(
    async (pausada) => {
      await panel.put('/tienda/pausa', { pausada });
      setTienda({ ...tienda, pausada });
    },
    { exito: (_, pausada) => (pausada ? 'Tienda pausada' : 'Tu tienda volvió a abrir') },
  );
  const logo = useAccion(
    async (archivo) => {
      await panel.subir('/tienda/logo', 'logo', archivo, 'PUT');
      recargarTienda();
    },
    { exito: 'Logo actualizado' },
  );
  const cobro = useAccion(
    async (d) => {
      await panel.put('/tienda/cobro', d);
      setTienda({ ...tienda, alias: d.alias, titularAlias: d.titularAlias });
    },
    { exito: 'Alias de cobro actualizado' },
  );
  return { tienda, pausa, logo, cobro };
}
