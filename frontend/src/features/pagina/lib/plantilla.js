import { ordenSecciones } from '../../tienda/lib/secciones.js';
import { AJUSTES_BASE, HERO_BASE } from './bases.js';

const productos = (titulo, vista, fuente, cantidad) => ({
  tipo: 'productos',
  datos: { titulo, bajada: null, vista, fuente, cantidad },
});

// Cada sección del inicio de antes, como bloque.
const DESDE_SECCION = {
  promo: () => ({
    tipo: 'banner',
    datos: {
      origen: 'promo',
      titulo: null,
      texto: null,
      boton: null,
      imagen: 'producto',
    },
  }),
  categorias: (s) => ({
    tipo: 'categorias',
    datos: { titulo: s.titulo ?? null, forma: 'circulos' },
  }),
  destacados: (s) => productos(s.titulo ?? null, 'carrusel', { tipo: 'destacados' }, 12),
  club: () => ({ tipo: 'club', datos: {} }),
  catalogo: (s) => productos(s.titulo ?? null, 'grilla', { tipo: 'todos' }, 48),
  nosotros: (s) => ({ tipo: 'nosotros', datos: { titulo: s.titulo ?? null } }),
  galeria: (s) => ({ tipo: 'galeria', datos: { titulo: s.titulo ?? null } }),
};

// La página de una tienda que todavía no armó la suya: la misma de siempre
// (hero, beneficios, sus secciones en su orden y el cierre), en bloques.
export function plantillaDesdeTienda(tienda) {
  const secciones = ordenSecciones(tienda.contenido?.secciones).filter(
    (s) => DESDE_SECCION[s.id],
  );
  return {
    version: 1,
    ajustes: AJUSTES_BASE,
    bloques: [
      { id: 'portada', tipo: 'hero', visible: true, datos: HERO_BASE },
      { id: 'beneficios', tipo: 'beneficios', visible: true, datos: {} },
      ...secciones.map((s) => ({
        id: s.id === 'catalogo' ? 'productos' : `sec${s.id}`,
        visible: s.visible,
        ...DESDE_SECCION[s.id](s),
      })),
      {
        id: 'cierre',
        tipo: 'cierre',
        visible: true,
        datos: { titulo: null, texto: null },
      },
    ],
  };
}
