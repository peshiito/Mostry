// HTTPS en producción (S3): HSTS y la redirección de http a https.
// Segunda capa detrás de Cloudflare ("Always Use HTTPS"): si alguien llega por
// http igual, lo mandamos a https. Nunca en *.localhost (la prueba con Caddy en
// local fijaría https para todo mostry.localhost en el navegador por un año).

const UN_ANIO = 31_536_000;
export const HSTS = `max-age=${UN_ANIO}; includeSubDomains`; // sin preload

export const conHttps = (dominio) =>
  Boolean(dominio) && dominio !== 'localhost' && !dominio.endsWith('.localhost');

// El host es del sitio si es el dominio o uno de sus subdominios.
const esDelSitio = (host, dominio) => host === dominio || host.endsWith(`.${dominio}`);

// Si el pedido llegó por http a través del proxy, a dónde redirigir (o null).
// /salud queda afuera: lo usan los chequeos internos, que van por http.
export function redireccionHttps({ proto, host, url, dominio }) {
  if (!conHttps(dominio) || proto !== 'http' || url === '/salud') return null;
  const sinPuerto = (host ?? '').split(':')[0].toLowerCase();
  if (!esDelSitio(sinPuerto, dominio)) return null; // nada de redirigir a otro sitio
  // La ruta tiene que empezar con una sola "/": "@otro.com" o "//otro.com"
  // armarían una URL que apunta a otro sitio.
  const ruta = /^\/(?!\/)/.test(url ?? '') ? url : '/';
  return `https://${sinPuerto}${ruta}`;
}

// Los encabezados de seguridad, con HSTS solo si el sitio va por https.
export const encabezadosSitio = (base, dominio) =>
  conHttps(dominio) ? { ...base, 'Strict-Transport-Security': HSTS } : base;
