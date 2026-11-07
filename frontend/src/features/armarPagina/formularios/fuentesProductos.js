// Opciones del bloque Productos.
export const FUENTES = [
  ['destacados', 'Lo más pedido (los destacados)'],
  ['todos', 'Todos los productos'],
  ['categoria', 'Los de una categoría'],
  ['elegidos', 'Los que elijas vos'],
];
export const CANTIDAD = [4, 8, 12, 24, 48].map((n) => [n, `Hasta ${n}`]);

export const fuenteNueva = (tipo, ctx) =>
  tipo === 'categoria'
    ? { tipo, id: ctx.c.categorias[0]?.id ?? 1 }
    : tipo === 'elegidos'
      ? { tipo, ids: ctx.c.productos.slice(0, 4).map((p) => p.id) }
      : { tipo };
export const VISTAS = [
  ['carrusel', 'Carrusel'],
  ['grilla', 'Grilla'],
];
