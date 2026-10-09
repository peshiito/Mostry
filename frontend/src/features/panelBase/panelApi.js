import { api } from '../../shared/api/cliente.js';

// Atajos para la API del panel. La base es /panel (la tienda la resuelve la API por
// el Origin y la sesión) o, en el modo soporte del admin, /admin/soporte/:id.
export function crearPanelApi(base) {
  return {
    get: (ruta) => api(`${base}${ruta}`),
    post: (ruta, cuerpo) => api(`${base}${ruta}`, { metodo: 'POST', cuerpo }),
    put: (ruta, cuerpo) => api(`${base}${ruta}`, { metodo: 'PUT', cuerpo }),
    patch: (ruta, cuerpo) => api(`${base}${ruta}`, { metodo: 'PATCH', cuerpo }),
    borrar: (ruta) => api(`${base}${ruta}`, { metodo: 'DELETE' }),
    subir: (ruta, campo, archivo, metodo = 'POST') => {
      const datos = new FormData();
      datos.append(campo, archivo);
      return api(`${base}${ruta}`, { metodo, archivo: datos });
    },
  };
}

export const panel = crearPanelApi('/panel');
