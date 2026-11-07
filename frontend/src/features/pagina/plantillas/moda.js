import * as p from './piezas.js';

// Ropa y accesorios: mucha foto, categorías en tarjetas y un producto en grande.
export const MODA = {
  street: [
    p.portada(),
    p.carrusel('Lo más buscado', { automatico: true }),
    p.categorias('tarjetas', 'Comprá por categoría'),
    p.destacado('El que no puede faltar', 'derecha'),
    p.todo('Todo el catálogo'),
    p.promo(),
    p.cierre('¿Dudas con el talle?', 'Escribinos y te ayudamos a elegir.'),
  ],
  boutique: [
    p.portada(),
    p.categorias('tarjetas', 'Colecciones'),
    p.destacado('Elegido de la temporada'),
    p.elegidos('Nuestros favoritos'),
    p.nosotros('Nuestra historia'),
    p.cierre('Te asesoramos', 'Contanos qué buscás y te mandamos opciones por WhatsApp.'),
  ],
  atelier: [
    p.portada(),
    p.texto(
      'Hecho a mano, de a poco',
      'Cada pieza la hacemos nosotros, con materiales que elegimos uno por uno. Por eso no hay dos iguales.',
    ),
    p.todo('Lo que hay ahora'),
    p.nosotros('Quiénes somos'),
    p.galeria('Del taller'),
    p.cierre('¿Querés algo a medida?', 'Escribinos y lo charlamos.'),
  ],
};
