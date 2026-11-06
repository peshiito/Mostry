import { useCallback, useEffect, useReducer } from 'react';
import { useAccion } from '../../../shared/api/useAccion.js';
import { useConsulta } from '../../../shared/api/useConsulta.js';
import { useBasePanel, usePanelApi } from '../../panelBase/BasePanel.jsx';
import { usePanel } from '../../panelBase/PanelContexto.jsx';
import { useVistaTienda } from '../../disenoTienda/vista/useVistaTienda.js';
import { plantillaDesdeTienda } from '../../pagina/lib/plantilla.js';
import { editor } from '../lib/historial.js';
import { useGuardadoSolo } from './useGuardadoSolo.js';

// "Armá tu página": carga el borrador (o lo publicado, o la página de siempre),
// guarda los cambios solos y publica.
export function usePaginaEditor() {
  const panel = usePanelApi();
  const { api } = useBasePanel();
  const { tienda } = usePanel();
  const vista = useVistaTienda(tienda.slug);
  const remota = useConsulta(`${api}/tienda/pagina`);
  const [estado, despachar] = useReducer(editor, null);
  useEffect(() => {
    if (estado || !remota.datos || !vista.valor) return;
    const { borrador, publicado } = remota.datos;
    const doc = borrador ?? publicado ?? plantillaDesdeTienda(vista.valor.tienda);
    despachar({ tipo: 'cargar', doc });
  }, [estado, remota.datos, vista.valor]);
  const guardar = useCallback(
    (doc) => panel.put('/tienda/pagina/borrador', doc),
    [panel],
  );
  const guardado = useGuardadoSolo(estado?.doc, guardar);
  const publicar = useAccion(
    async () => {
      if (!(await guardado.ya())) throw new Error('No pudimos guardar los cambios');
      return panel.post('/tienda/pagina/publicar');
    },
    { exito: 'Listo, tu página ya está publicada' },
  );
  return {
    doc: estado?.doc ?? null,
    puedeDeshacer: Boolean(estado?.antes.length),
    puedeRehacer: Boolean(estado?.despues.length),
    despachar,
    valor: vista.valor,
    error: remota.error ?? vista.error,
    guardado: guardado.estado,
    publicar,
  };
}
