import { HERO_BASE } from '../../pagina/lib/bases.js';

// Con qué arranca cada bloque nuevo que se agrega desde la biblioteca.
export const DEFECTOS = {
  hero: () => structuredClone(HERO_BASE),
  beneficios: () => ({}),
  categorias: () => ({ titulo: null, forma: 'circulos' }),
  productos: () => ({
    titulo: null,
    bajada: null,
    vista: 'carrusel',
    fuente: { tipo: 'destacados' },
    cantidad: 8,
  }),
  banner: () => ({
    origen: 'propio',
    titulo: 'Tu anuncio acá',
    texto: 'Contá una novedad, una promo o lo que quieras destacar.',
    boton: { texto: 'Ver productos', destino: { tipo: 'catalogo' } },
    imagen: 'producto',
  }),
  texto: () => ({
    titulo: null,
    cuerpo: 'Contá algo de tu negocio.',
    alineacion: 'izquierda',
  }),
  nosotros: () => ({ titulo: null }),
  galeria: () => ({ titulo: null }),
  cierre: () => ({ titulo: null, texto: null }),
  club: () => ({}),
  separador: () => ({ tamano: 'medio', linea: false }),
};

export const nuevoId = () =>
  `b${Math.random().toString(36).slice(2, 9)}`.padEnd(8, '0').slice(0, 12);
