// Adapta productos y categorías públicos al formato de las pantallas.
// La API no expone el stock: solo si está disponible (el servidor valida al comprar).
const ICONOS = [
  [/factura|medialuna/i, 'bakery_dining'],
  [/torta|postre|pastel/i, 'cake'],
  [/pan/i, 'breakfast_dining'],
  [/salad|sandw|empanada/i, 'lunch_dining'],
];

const iconoCategoria = (nombre) =>
  ICONOS.find(([re]) => re.test(nombre))?.[1] ?? 'storefront';

const SIN_FOTO = '/sin-foto.svg';
const srcset = (f) =>
  f?.chica && f?.grande ? `${f.chica} 400w, ${f.grande} 1200w` : undefined;

export const adaptarProducto = (p) => ({
  ...p,
  descripcion: p.descripcion ?? '',
  foto: (p.foto ?? p.fotos?.[0])?.chica ?? SIN_FOTO,
  fotoGrande: (p.fotos?.[0] ?? p.foto)?.grande ?? SIN_FOTO,
  // El navegador elige la variante según la pantalla (400 o 1200 px de lado).
  fotoSrcset: srcset(p.fotos?.[0] ?? p.foto),
  agotado: !p.disponible,
  stock: p.disponible ? 99 : 0,
});

export const adaptarCategoria = (c) => ({
  ...c,
  cantidad: c.productos,
  icono: iconoCategoria(c.nombre),
});
