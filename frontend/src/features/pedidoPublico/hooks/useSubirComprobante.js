import { useSubida } from '../../../shared/api/useSubida.js';
import { publicoApi } from '../../tienda/api/publico.js';

// POST /publico/pedidos/:token/comprobante (multipart). La API valida por magic bytes.
export function useSubirComprobante() {
  const accion = useSubida(
    (onProgreso, token, archivo) =>
      publicoApi.subirComprobante(token, archivo, onProgreso),
    { exito: 'Comprobante enviado. La tienda lo va a revisar.' },
  );
  return {
    subir: accion.ejecutar,
    enviando: accion.enviando,
    error: accion.error,
    progreso: accion.progreso,
  };
}
