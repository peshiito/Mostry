import { panel } from '../../panelBase/panelApi.js';
import { suscripcionActual } from './soportePush.js';

// Al cerrar sesión: este teléfono deja de recibir los avisos de la tienda
// (si no, le seguirían llegando a quien use el teléfono después). Si falla,
// no frena la salida.
export async function apagarAvisosAlSalir() {
  try {
    const s = await suscripcionActual();
    if (!s) return;
    await panel.post('/avisos/suscripciones/baja', { endpoint: s.endpoint });
    await s.unsubscribe();
  } catch {
    /* sin conexión o sin service worker: sale igual */
  }
}
