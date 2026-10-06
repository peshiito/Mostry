import { useAccion } from '../../../shared/api/useAccion.js';
import { publicoApi } from '../../tienda/api/publico.js';

// POST /publico/pedidos/:token/comprobante (multipart). La API valida por magic bytes.
export function useSubirComprobante() {
  const accion = useAccion(publicoApi.subirComprobante, {
    exito: 'Comprobante enviado. La tienda lo va a revisar.',
  });
  return { subir: accion.ejecutar, enviando: accion.enviando, error: accion.error };
}
