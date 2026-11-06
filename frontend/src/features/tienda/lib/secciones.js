// Secciones del inicio de la vidriera y su orden (Vidriera 2.0, V4). El comercio
// las ordena, esconde y renombra; las que no tocó van al final, visibles.
export const SECCIONES = [
  ['promo', 'Promoción'],
  ['categorias', 'Categorías'],
  ['destacados', 'Lo más pedido'],
  ['club', 'Club de clientes'],
  ['catalogo', 'Todo lo que hay'],
  ['nosotros', 'Sobre nosotros'],
  ['galeria', 'Nuestro local'],
  ['envios', 'Envíos'],
];

export const NOMBRE_SECCION = Object.fromEntries(SECCIONES);

export function ordenSecciones(guardadas = []) {
  const vistas = new Set(guardadas.map((s) => s.id));
  const resto = SECCIONES.filter(([id]) => !vistas.has(id)).map(([id]) => ({
    id,
    visible: true,
  }));
  return [...guardadas.filter((s) => NOMBRE_SECCION[s.id]), ...resto];
}
