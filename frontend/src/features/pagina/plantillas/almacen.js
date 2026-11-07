import * as p from './piezas.js';

// Almacén, verdulería, librería y bebidas: buscar rápido por categoría.
export const ALMACEN = {
  kiosco: [
    p.portada(),
    p.beneficios(),
    p.categorias('circulos'),
    p.promo('Ofertas de la semana'),
    p.todo('Todo lo que tenemos'),
    p.cierre('¿No encontrás algo?', 'Preguntanos: capaz lo tenemos en el local.'),
  ],
  huerta: [
    p.portada(),
    p.beneficios(),
    p.categorias('circulos'),
    p.elegidos('De estación'),
    p.texto(
      'Del campo a tu mesa',
      'Compramos todos los días y elegimos lo más fresco. Lo que no está bueno, no lo vendemos.',
    ),
    p.todo('Todo lo que hay hoy'),
    p.cierre('Armá tu pedido', 'Mandanos la lista por WhatsApp y te lo preparamos.'),
  ],
  cuaderno: [
    p.portada(),
    p.categorias('tarjetas', 'Encontrá lo que buscás'),
    p.carrusel('Lo más pedido'),
    p.promo(),
    p.todo('Todo el catálogo'),
    p.cierre('¿Tenés la lista del cole?', 'Mandala por WhatsApp y te la armamos.'),
  ],
  bodega: [
    p.portada(),
    p.destacado('La etiqueta del mes', 'derecha'),
    p.categorias('tarjetas', 'Elegí por tipo'),
    p.carrusel('Los que más salen'),
    p.texto(
      'Te ayudamos a elegir',
      'Contanos para qué ocasión es y qué te gusta: te recomendamos sin vueltas.',
    ),
    p.galeria(),
    p.cierre('¿Para un regalo?', 'Escribinos y lo armamos.'),
  ],
};
