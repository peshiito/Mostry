import { useAccion } from '../../../shared/api/useAccion.js';
import { useSubida } from '../../../shared/api/useSubida.js';
import { useConsulta } from '../../../shared/api/useConsulta.js';
import { useBasePanel, usePanelApi } from '../../panelBase/BasePanel.jsx';

// Fotos de un producto: la API las valida y las pasa a WebP (sección 7).
export function useFotos(productoId) {
  const panel = usePanelApi();
  const base = useBasePanel();
  const ruta = productoId ? `/productos/${productoId}/fotos` : null;
  const {
    datos,
    error: errorCarga,
    recargar,
  } = useConsulta(ruta ? `${base.api}${ruta}` : null);
  const subir = useSubida(
    (alAvanzar, archivo) => panel.subir(ruta, 'foto', archivo, 'POST', alAvanzar),
    {
      exito: 'Foto agregada',
    },
  );
  const borrar = useAccion((fotoId) => panel.borrar(`${ruta}/${fotoId}`), {
    exito: 'Foto eliminada',
  });
  return {
    fotos: datos ?? [],
    errorCarga,
    recargar,
    agregar: async (archivo) => (await subir.ejecutar(archivo)).ok && recargar(),
    quitar: async (fotoId) => (await borrar.ejecutar(fotoId)).ok && recargar(),
    error: subir.error ?? borrar.error,
    subiendo: subir.enviando,
    progreso: subir.progreso,
  };
}
