// Links entre zonas (sitio, tienda, admin) según el dominio base del entorno.
const base = () => import.meta.env.VITE_DOMINIO_BASE ?? 'mostry.localhost';
const puerto = () => (window.location.port ? `:${window.location.port}` : '');
const url = (sub, ruta) =>
  `${window.location.protocol}//${sub ? `${sub}.` : ''}${base()}${puerto()}${ruta}`;

export const urlSitio = (ruta = '/') => url('', ruta);
export const urlTienda = (slug, ruta = '/') => url(slug, ruta);
export const urlAdmin = (ruta = '/') => url('admin', ruta);
