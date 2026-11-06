import { useAccion } from '../../../shared/api/useAccion.js';
import { useConsulta } from '../../../shared/api/useConsulta.js';
import { useSubida } from '../../../shared/api/useSubida.js';
import { useBasePanel, usePanelApi } from '../../panelBase/BasePanel.jsx';

// La biblioteca de imágenes de la tienda (fotos y GIF) para los bloques.
export function useMedios() {
  const panel = usePanelApi();
  const { api } = useBasePanel();
  const lista = useConsulta(`${api}/tienda/medios`);
  const subir = useSubida(
    async (alAvanzar, archivo) => {
      const r = await panel.subir(
        '/tienda/medios',
        'archivo',
        archivo,
        'POST',
        alAvanzar,
      );
      lista.recargar();
      return r;
    },
    { exito: 'Imagen agregada' },
  );
  const borrar = useAccion(
    async (id) => {
      await panel.borrar(`/tienda/medios/${id}`);
      lista.recargar();
    },
    { exito: 'Imagen borrada' },
  );
  return { lista: lista.datos ?? [], cargando: lista.cargando, subir, borrar };
}
