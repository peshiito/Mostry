import { useState } from 'react';
import { useAccion } from '../../../shared/api/useAccion.js';
import { useConsulta } from '../../../shared/api/useConsulta.js';
import { useSubida } from '../../../shared/api/useSubida.js';
import { usePanelApi } from '../../panelBase/BasePanel.jsx';
import { usePanel } from '../../panelBase/PanelContexto.jsx';
import { ordenSecciones } from '../../tienda/lib/secciones.js';

const base = '/tienda/vidriera';

// Contenido de la vidriera (V4): portada, galería, "Sobre nosotros", redes y
// orden de las secciones. Las fotos se suben al toque; el texto, al guardar.
export function useVidriera() {
  const panel = usePanelApi();
  const { tienda, setTienda, recargarTienda } = usePanel();
  const inicial = tienda.contenido ?? {};
  const [contenido, setContenido] = useState({
    sobreNosotros: inicial.sobreNosotros ?? '',
    redes: { instagram: '', tiktok: '', facebook: '', web: '', ...inicial.redes },
    secciones: ordenSecciones(inicial.secciones),
  });
  const galeria = useConsulta(`/panel${base}/galeria`);
  const limpiar = (r) =>
    Object.fromEntries(Object.entries(r).map(([k, v]) => [k, v.trim() || null]));
  const guardar = useAccion(
    async () => {
      const datos = {
        sobreNosotros: contenido.sobreNosotros.trim() || null,
        redes: limpiar(contenido.redes),
        secciones: contenido.secciones,
      };
      const r = await panel.put(`${base}/contenido`, datos);
      setTienda({ ...tienda, contenido: r.contenido });
    },
    { exito: 'Tu vidriera quedó actualizada' },
  );
  const portada = useSubida(
    async (alAvanzar, archivo) => {
      await panel.subir(`${base}/portada`, 'portada', archivo, 'PUT', alAvanzar);
      recargarTienda();
    },
    { exito: 'Portada actualizada' },
  );
  const foto = useSubida(
    async (alAvanzar, archivo) => {
      await panel.subir(`${base}/galeria`, 'foto', archivo, 'POST', alAvanzar);
      galeria.recargar();
    },
    { exito: 'Foto agregada' },
  );
  const borrarFoto = useAccion(
    async (id) => {
      await panel.borrar(`${base}/galeria/${id}`);
      galeria.recargar();
    },
    { exito: 'Foto borrada' },
  );
  return { tienda, contenido, setContenido, guardar, portada, foto, borrarFoto, galeria };
}
