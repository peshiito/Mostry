import { useState } from 'react';
import { useAccion } from '../../../shared/api/useAccion.js';
import { panel } from '../../panelBase/panelApi.js';

// Manda el reporte y, si hay, la captura (dos pasos: la API recibe el archivo aparte).
// Si la captura falla, el reporte igual quedó enviado: se avisa sin perderlo.
export function useReportar() {
  const [pantalla, setPantalla] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [captura, setCaptura] = useState(null);
  const [enviado, setEnviado] = useState(null);
  const accion = useAccion(
    async () => {
      const r = await panel.post('/reportes', { pantalla, descripcion });
      let capturaFallo = false;
      if (captura) {
        await panel
          .subir(`/reportes/${r.id}/captura`, 'captura', captura, 'PUT')
          .catch((e) => (capturaFallo = e?.message || true));
      }
      return { ...r, descripcion, capturaFallo };
    },
    { exito: (r) => `Reporte #${r.numero} enviado` },
  );
  async function enviar(e) {
    e.preventDefault();
    const r = await accion.ejecutar();
    if (r.ok) setEnviado(r.datos);
  }
  return {
    pantalla,
    setPantalla,
    descripcion,
    setDescripcion,
    captura,
    setCaptura,
    enviar,
    accion,
    enviado,
  };
}
