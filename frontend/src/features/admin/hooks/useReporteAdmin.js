import { useState } from 'react';
import { api } from '../../../shared/api/cliente.js';
import { useAccion } from '../../../shared/api/useAccion.js';
import { useConsulta } from '../../../shared/api/useConsulta.js';

// Detalle de un reporte (con la captura por URL firmada) y la respuesta del admin.
export function useReporteAdmin(id, onCambio) {
  const c = useConsulta(id ? `/admin/reportes/${id}` : null);
  const [estado, setEstado] = useState(null);
  const [respuesta, setRespuesta] = useState(null);
  const accion = useAccion(
    async () => {
      const r = await api(`/admin/reportes/${id}`, {
        metodo: 'PATCH',
        cuerpo: {
          estado: estado ?? c.datos.estado,
          respuesta: (respuesta ?? c.datos.respuesta ?? '') || null,
        },
      });
      c.setDatos(r);
      onCambio();
    },
    { exito: 'Reporte actualizado' },
  );
  return {
    reporte: c.datos,
    cargando: c.cargando,
    error: c.error,
    recargar: c.recargar,
    estado: estado ?? c.datos?.estado,
    setEstado,
    respuesta: respuesta ?? c.datos?.respuesta ?? '',
    setRespuesta,
    accion,
  };
}
