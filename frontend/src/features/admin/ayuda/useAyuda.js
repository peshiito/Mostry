import { useAccion } from '../../../shared/api/useAccion.js';
import { adminApi } from '../api/admin.js';

// Acciones de ayuda sobre una tienda. Al terminar bien, recarga el detalle.
export function useAyuda(id, recargar) {
  const conRecarga = (fn) => async (d) => {
    const r = await fn(id, d);
    recargar();
    return r;
  };
  return {
    dueno: useAccion(conRecarga(adminApi.cambiarDueno), {
      exito: 'Datos del dueño guardados',
    }),
    datos: useAccion(conRecarga(adminApi.corregirTienda), { exito: 'Tienda corregida' }),
    clave: useAccion(() => adminApi.claveTemporal(id)),
    mail: useAccion(() => adminApi.reenviarMail(id), {
      exito: (r) => `Le mandamos el código a ${r.email}`,
    }),
    eliminar: useAccion((d) => adminApi.eliminar(id, d), { exito: 'Tienda eliminada' }),
  };
}

// Solo lo que cambió (la API rechaza un PATCH vacío y no hace falta pisar lo igual).
export const cambios = (nuevo, viejo) =>
  Object.fromEntries(Object.entries(nuevo).filter(([k, v]) => v !== (viejo[k] ?? '')));
