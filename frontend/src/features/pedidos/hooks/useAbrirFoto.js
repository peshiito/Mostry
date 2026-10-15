import { useAccion } from '../../../shared/api/useAccion.js';
import { panel } from '../../panelBase/panelApi.js';

// Abre la foto de referencia de un encargo con su URL firmada de 5 minutos
// (se pide recién al tocar). La pestaña se abre en el mismo toque: si no, el
// bloqueador de ventanas la frena.
export function useAbrirFoto(pedidoId) {
  return useAccion(async (itemId) => {
    const ventana = window.open('', '_blank');
    if (!ventana)
      throw new Error(
        'Tu navegador bloqueó la ventana. Permití las ventanas emergentes.',
      );
    ventana.opener = null;
    try {
      ventana.location.href = (
        await panel.get(`/pedidos/${pedidoId}/items/${itemId}/foto`)
      ).url;
    } catch (e) {
      ventana.close();
      throw e;
    }
  });
}
