import { api } from '../../shared/api/cliente.js';

// Atajos para /panel/* (la tienda la resuelve la API por el Origin y la sesión).
export const panel = {
  get: (ruta) => api(`/panel${ruta}`),
  post: (ruta, cuerpo) => api(`/panel${ruta}`, { metodo: 'POST', cuerpo }),
  put: (ruta, cuerpo) => api(`/panel${ruta}`, { metodo: 'PUT', cuerpo }),
  patch: (ruta, cuerpo) => api(`/panel${ruta}`, { metodo: 'PATCH', cuerpo }),
  borrar: (ruta) => api(`/panel${ruta}`, { metodo: 'DELETE' }),
  subir: (ruta, campo, archivo, metodo = 'POST') => {
    const datos = new FormData();
    datos.append(campo, archivo);
    return api(`/panel${ruta}`, { metodo, archivo: datos });
  },
};
