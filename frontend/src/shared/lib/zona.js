// Decide qué app mostrar según el subdominio (sección 13: cuatro zonas).
// mostry.com.ar → sitio · admin.mostry.com.ar → admin · <slug>.mostry.com.ar → tienda.
const RESERVADOS = new Set(['www', 'api', 'app', 'panel', 'mail', 'static']);

// localhost o una IP local "pelada" (sin el dominio de Mostry): en desarrollo es
// la dirección que uno tipea de memoria, así que se manda a la landing.
export const esHostLocalSuelto = (host) =>
  ['localhost', '127.0.0.1', '[::1]', '::1'].includes(host.toLowerCase());

export function zonaDesdeHost(host, dominioBase) {
  const h = host.toLowerCase();
  if (h === dominioBase) return { zona: 'sitio' };
  if (!h.endsWith(`.${dominioBase}`)) return { zona: 'desconocida' };
  const sub = h.slice(0, -(dominioBase.length + 1));
  if (sub === 'admin') return { zona: 'admin' };
  if (sub === 'www') return { zona: 'sitio' };
  if (sub.includes('.') || RESERVADOS.has(sub)) return { zona: 'desconocida' };
  return { zona: 'tienda', slug: sub };
}
