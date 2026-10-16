import { useEffect, useState } from 'react';
import { useAccion } from '../../../shared/api/useAccion.js';
import { useConsulta } from '../../../shared/api/useConsulta.js';
import { panel } from '../../panelBase/panelApi.js';
import {
  aBytes,
  nombreDispositivo,
  situacion,
  suscripcionActual,
} from '../lib/soportePush.js';

const sinApp = () =>
  new Error(
    'Los avisos andan con el panel publicado (en tu PC de pruebas, con el build).',
  );

// Avisos 1: activar, desactivar y probar los avisos en ESTE teléfono, y el
// horario de silencio (GET /panel/avisos). El permiso se pide solo al tocar.
export function useAvisos() {
  const consulta = useConsulta('/panel/avisos');
  const [aca, setAca] = useState(null); // la suscripción de este navegador
  useEffect(() => {
    suscripcionActual().then(setAca, () => setAca(null));
  }, []);
  const activar = useAccion(
    async () => {
      if ((await Notification.requestPermission()) !== 'granted')
        throw new Error('No diste permiso para los avisos.');
      const reg = await navigator.serviceWorker.getRegistration('/');
      if (!reg) throw sinApp();
      const s = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: aBytes(consulta.datos.clavePublica),
      });
      await panel.post('/avisos/suscripciones', {
        ...s.toJSON(),
        dispositivo: nombreDispositivo(),
      });
      setAca(s);
      consulta.recargar();
    },
    { exito: 'Listo: los avisos llegan a este teléfono' },
  );
  const desactivar = useAccion(
    async () => {
      if (aca) {
        await panel.post('/avisos/suscripciones/baja', { endpoint: aca.endpoint });
        await aca.unsubscribe();
      }
      setAca(null);
      consulta.recargar();
    },
    { exito: 'Apagaste los avisos en este teléfono' },
  );
  const probar = useAccion(() => panel.post('/avisos/probar'), {
    exito: 'Te mandamos un aviso: llega en unos segundos',
  });
  return {
    consulta,
    situacion: situacion(),
    activo: Boolean(aca),
    activar,
    desactivar,
    probar,
  };
}
