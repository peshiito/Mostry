import { useEffect, useState } from 'react';
import { useAccion } from '../../../shared/api/useAccion.js';
import { cargarFuentes } from '../../../shared/temaTienda/cargarFuentes.js';
import { TEMAS, temaEfectivo } from '../../../shared/temaTienda/temas.js';
import { usePanelApi } from '../../panelBase/BasePanel.jsx';
import { usePanel } from '../../panelBase/PanelContexto.jsx';

// Borrador del diseño de la tienda (V1): se edita acá y recién se publica al guardar.
export function useDiseno() {
  const panel = usePanelApi();
  const { tienda, setTienda } = usePanel();
  const [tema, setTema] = useState(() => temaEfectivo(tienda));
  const accion = useAccion((t) => panel.put('/tienda/tema', t), {
    exito: 'Listo, tu tienda ya tiene el diseño nuevo',
  });
  // Para que las muestras se vean con su tipografía de verdad.
  useEffect(() => {
    cargarFuentes(TEMAS.flatMap((t) => [t.tema.fuentes.titulos, t.tema.fuentes.texto]));
  }, []);
  useEffect(() => {
    cargarFuentes([tema.fuentes.titulos, tema.fuentes.texto]);
  }, [tema.fuentes.titulos, tema.fuentes.texto]);

  const cambiar = (parte) => setTema((t) => ({ ...t, ...parte }));
  async function guardar() {
    const r = await accion.ejecutar(tema);
    if (r.ok) setTienda({ ...tienda, tema: r.datos.tema });
  }
  const cambios = JSON.stringify(tema) !== JSON.stringify(temaEfectivo(tienda));
  return {
    tema,
    setTema,
    cambiar,
    guardar,
    accion,
    cambios,
    slug: tienda.slug,
    nombre: tienda.nombre,
  };
}
