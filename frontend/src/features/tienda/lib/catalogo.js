// Adapta productos y categorías públicos al formato de las pantallas.
// La API no expone el stock: solo si está disponible (el servidor valida al comprar).
const ICONOS = [
  [/factura|medialuna/i, 'bakery_dining'],
  [/torta|postre|pastel/i, 'cake'],
  [/pan/i, 'breakfast_dining'],
  [/salad|sandw|empanada/i, 'lunch_dining'],
];

export const iconoCategoria = (nombre) =>
  ICONOS.find(([re]) => re.test(nombre))?.[1] ?? 'storefront';

const SIN_FOTO = '/sin-foto.svg';

export const adaptarProducto = (p) => ({
  ...p,
  descripcion: p.descripcion ?? '',
  foto: (p.foto ?? p.fotos?.[0])?.chica ?? SIN_FOTO,
  fotoGrande: (p.fotos?.[0] ?? p.foto)?.grande ?? SIN_FOTO,
  agotado: !p.disponible,
  stock: p.disponible ? 99 : 0,
});

export const adaptarCategoria = (c) => ({
  ...c,
  cantidad: c.productos,
  icono: iconoCategoria(c.nombre),
});
