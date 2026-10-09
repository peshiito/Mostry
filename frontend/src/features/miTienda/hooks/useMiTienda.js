import { useState } from 'react';
import { useAccion } from '../../../shared/api/useAccion.js';

import { usePanel } from '../../panelBase/PanelContexto.jsx';
import { usePanelApi } from '../../panelBase/BasePanel.jsx';

const CAMPOS = [
  'nombre',
  'frase',
  'whatsapp',
  'direccion',
  'paleta',
  'zonaEnvio',
  'costoEnvio',
  'aceptaEnvio',
  'aceptaRetiro',
  'plazoComprobanteHoras',
  'plazoSenaHoras',
  'anticipacionEncargoHoras',
  'senaPorcentaje',
];
const NUMEROS = [
  'costoEnvio',
  'plazoComprobanteHoras',
  'plazoSenaHoras',
  'anticipacionEncargoHoras',
  'senaPorcentaje',
];

// Configuración de la tienda (PATCH /tienda/config): solo se mandan los cambios.
export function useMiTienda() {
  const panel = usePanelApi();
  const { tienda, setTienda } = usePanel();
  const [t, setT] = useState(tienda);
  const [guardado, setGuardado] = useState(false);
  const accion = useAccion((cambios) => panel.patch('/tienda/config', cambios), {
    exito: 'Cambios guardados',
  });
  async function guardar(e) {
    e?.preventDefault();
    const cambios = {};
    for (const k of CAMPOS) {
      const v = NUMEROS.includes(k) ? Math.round(Number(t[k])) : t[k];
      if (v !== tienda[k]) cambios[k] = v;
    }
    if (!Object.keys(cambios).length) return;
    const r = await accion.ejecutar(cambios);
    if (!r.ok) return;
    setTienda({ ...tienda, ...cambios, ...r.datos });
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2500);
  }
  return { t, setT, guardar, guardado, accion, errores: accion.campos };
}
