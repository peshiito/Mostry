// Secciones donde puede pasar un problema (las mismas que valida la API).
export const PANTALLAS = [
  ['inicio', 'Inicio del panel'],
  ['pedidos', 'Pedidos'],
  ['productos', 'Productos y stock'],
  ['caja', 'Caja'],
  ['encargos', 'Encargos'],
  ['libreta', 'Libreta de fiados'],
  ['gastos', 'Gastos y proveedores'],
  ['mi_tienda', 'Mi tienda'],
  ['tienda_publica', 'Mi tienda online (lo que ven los clientes)'],
  ['otra', 'Otra cosa'],
];

export const nombrePantalla = (clave) =>
  PANTALLAS.find(([c]) => c === clave)?.[1] ?? 'Otra cosa';

export const ESTADOS_REPORTE = {
  nuevo: { texto: 'Enviado', tono: 'gris' },
  en_curso: { texto: 'En revisión', tono: 'mostaza' },
  resuelto: { texto: 'Resuelto', tono: 'ok' },
};
