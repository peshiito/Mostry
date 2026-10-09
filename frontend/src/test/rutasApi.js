// Respuestas grabadas de la API local (Doña Rosa y el admin) para los tests del frontend.
const f = import.meta.glob('./fixtures/*.json', { eager: true, import: 'default' });
const r = (nombre) => f[`./fixtures/${nombre}.json`];

// [método, patrón de la ruta, fixture]. El primero que coincide gana.
const RESPUESTAS = [
  ['GET', /^\/publico\/tienda$/, 'publico-tienda'],
  ['GET', /^\/publico\/categorias$/, 'publico-categorias'],
  ['GET', /^\/publico\/productos$/, 'publico-productos'],
  ['GET', /^\/publico\/productos\/\d+$/, 'publico-producto'],
  ['GET', /^\/publico\/pedidos\/[\w-]{43}$/, 'publico-pedido'],
  ['GET', /^\/publico\/encargos\/disponibilidad/, null],
  ['GET', /^\/auth\/yo$/, 'yo'],
  ['GET', /^\/panel\/tienda\/config$/, 'config'],
  ['GET', /^\/panel\/tienda\/suscripcion$/, 'suscripcion'],
  ['GET', /^\/panel\/caja\/resumen/, 'caja-resumen'],
  ['GET', /^\/panel\/caja\/historial$/, 'caja-historial'],
  ['GET', /^\/panel\/caja$/, 'caja'],
  ['GET', /^\/panel\/pedidos\/\d+\/comprobantes$/, 'comprobantes'],
  ['GET', /^\/panel\/pedidos\/\d+$/, 'pedido'],
  ['GET', /^\/panel\/pedidos/, 'pedidos'],
  ['GET', /^\/panel\/encargos/, []],
  ['GET', /^\/panel\/productos\/\d+\/fotos$/, []],
  ['GET', /^\/panel\/productos\/\d+$/, 'producto'],
  ['GET', /^\/panel\/productos/, 'productos'],
  ['GET', /^\/panel\/categorias$/, 'categorias'],
  ['GET', /^\/panel\/promociones$/, 'promociones'],
  ['GET', /^\/panel\/gastos/, 'gastos'],
  ['GET', /^\/panel\/proveedores$/, 'proveedores'],
  ['GET', /^\/panel\/libreta\/clientes\/\d+$/, 'cliente'],
  ['GET', /^\/panel\/libreta\/clientes$/, 'clientes'],
  ['GET', /^\/panel\/libreta\/notas$/, 'notas'],
  ['GET', /^\/panel\/horarios$/, 'horarios'],
  ['GET', /^\/panel\/feriados$/, 'feriados'],
  ['GET', /^\/admin\/tiendas\/\d+$/, 'admin-tienda'],
  ['GET', /^\/admin\/tiendas/, 'admin-tiendas'],
  ['GET', /^\/admin\/metricas$/, 'admin-metricas'],
];

export function respuesta(metodo, ruta, admin) {
  if (admin && ruta === '/auth/yo') return r('yo-admin');
  const fila = RESPUESTAS.find(([m, re]) => m === metodo && re.test(ruta));
  if (!fila) return undefined;
  const [, , datos] = fila;
  if (datos === null)
    return { fecha: '2026-10-08', disponible: true, motivo: null, tramos: [] };
  return typeof datos === 'string' ? r(datos) : datos;
}
