import { useAccion } from '../../../shared/api/useAccion.js';
import { panel } from '../../panelBase/panelApi.js';

// Abre el comprobante con su URL firmada de 5 minutos (se pide recién al tocar, sección 7).
// La pestaña se abre en el mismo toque: si no, el bloqueador de ventanas la frena.
export function useAbrirComprobante(ruta, comprobanteId) {
  return useAccion(async () => {
    const ventana = window.open('', '_blank');
    if (!ventana)
      throw new Error(
        'Tu navegador bloqueó la ventana. Permití las ventanas emergentes.',
      );
    ventana.opener = null;
    try {
      ventana.location.href = (await panel.get(`${ruta}/${comprobanteId}/archivo`)).url;
    } catch (e) {
      ventana.close();
      throw e;
    }
  });
}
