import { useEffect } from 'react';
import { panel } from '../../panelBase/panelApi.js';
import { nombreDispositivo, suscripcionActual } from '../lib/soportePush.js';

// Al abrir el panel: si este teléfono tiene los avisos activados, vuelve a
// mandar su suscripción (el navegador a veces la renueva) y borra el número
// del ícono de la app (ya está mirando el panel). Nunca pide permisos.
export function useSincronizarAvisos(activo = true) {
  useEffect(() => {
    if (!activo) return; // el modo soporte del admin no toca los avisos del comercio
    navigator.clearAppBadge?.().catch(() => {});
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted')
      return;
    suscripcionActual()
      .then((s) =>
        s
          ? panel.post('/avisos/suscripciones', {
              ...s.toJSON(),
              dispositivo: nombreDispositivo(),
            })
          : null,
      )
      .catch(() => {}); // sin conexión o sin sesión: se reintenta la próxima vez
  }, [activo]);
}
