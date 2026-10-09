import { useAccion } from '../../../shared/api/useAccion.js';
import { useConsulta } from '../../../shared/api/useConsulta.js';
import { api } from '../../../shared/api/cliente.js';

// Plantillas de WhatsApp del admin (GET/PUT/DELETE /admin/plantillas).
export function usePlantillas() {
  const c = useConsulta('/admin/plantillas');
  const accion = useAccion(
    async (metodo, clave, texto) => {
      const r = await api(`/admin/plantillas/${clave}`, {
        metodo,
        cuerpo: texto === undefined ? undefined : { texto },
      });
      c.setDatos(r);
    },
    {
      exito: (_, metodo) =>
        metodo === 'PUT' ? 'Plantilla guardada' : 'Volvió al texto original',
    },
  );
  return {
    plantillas: c.datos?.plantillas ?? [],
    datos: c.datos?.datos,
    cargando: c.cargando,
    error: c.error,
    recargar: c.recargar,
    accion,
    guardar: (clave, texto) => accion.ejecutar('PUT', clave, texto),
    restaurar: (clave) => accion.ejecutar('DELETE', clave),
  };
}
