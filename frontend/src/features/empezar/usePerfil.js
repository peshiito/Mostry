import { useState } from 'react';
import { useAccion } from '../../shared/api/useAccion.js';
import { usePanel } from '../panelBase/PanelContexto.jsx';
import { usePanelApi } from '../panelBase/BasePanel.jsx';
import { PERFIL_INICIAL, sugerencia } from './opciones.js';

const CLAVES = Object.keys(PERFIL_INICIAL);

// Las respuestas de "Armá tu Mostry" y cómo se guardan. Al guardar, el panel se
// acomoda al toque (la config de la tienda se actualiza en el contexto).
export function usePerfil({ exito } = {}) {
  const panel = usePanelApi();
  const { tienda, setTienda } = usePanel();
  const deTienda = tienda.configuradaEn
    ? Object.fromEntries(CLAVES.map((k) => [k, tienda[k] ?? PERFIL_INICIAL[k]]))
    : PERFIL_INICIAL;
  const [perfil, setPerfil] = useState(deTienda);
  const cambiar = (k, v) => setPerfil((p) => ({ ...p, [k]: v }));
  // Elegir rubro aplica su sugerencia (se puede cambiar después).
  const elegirRubro = (rubro) =>
    setPerfil((p) => ({ ...p, rubro, ...sugerencia(rubro) }));
  const accion = useAccion(
    async () => {
      // Los encargos se piden desde la tienda online: sin ella no hay encargos.
      const final = { ...perfil, usaEncargos: perfil.vendeOnline && perfil.usaEncargos };
      await panel.put('/tienda/perfil', final);
      setTienda({ ...tienda, ...final, configuradaEn: new Date().toISOString() });
    },
    { exito },
  );
  return { perfil, cambiar, elegirRubro, accion };
}
