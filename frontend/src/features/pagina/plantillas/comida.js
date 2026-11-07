import * as p from './piezas.js';

// Comida: lo que más sale bien arriba, la promo a la vista y el encargo al final.
export const COMIDA = {
  horno: [
    p.portada(),
    p.beneficios(),
    p.carrusel('Lo que más sale'),
    p.categorias('circulos'),
    p.promo(),
    p.todo('Todo lo del día'),
    p.club(),
    p.cierre('¿Tenés un evento?', 'Encargá tortas, docenas y bandejas con anticipación.'),
  ],
  cocina: [
    p.portada(),
    p.beneficios(),
    p.promo('Menú del día'),
    p.elegidos('Lo más pedido'),
    p.categorias('circulos'),
    p.todo('El menú completo'),
    p.cierre('Pedí por WhatsApp', 'Te avisamos cuándo sale tu pedido.'),
  ],
  cafe: [
    p.portada(),
    p.texto(
      'Café recién tostado',
      'Elegimos cada grano y lo tostamos en chiquito para que llegue fresco a tu taza.',
    ),
    p.carrusel('Para llevar'),
    p.galeria('El local'),
    p.nosotros('Nuestra historia'),
    p.cierre('Pasá a tomar uno', 'O pedilo y te lo tenemos listo.'),
  ],
  dulce: [
    p.portada(),
    p.carrusel('Sabores de la casa', { automatico: true }),
    p.categorias('tarjetas', 'Elegí tu antojo'),
    p.promo(),
    p.club(),
    p.cierre('¿Lo querés en casa?', 'Pedilo por WhatsApp y te lo llevamos.'),
  ],
};
