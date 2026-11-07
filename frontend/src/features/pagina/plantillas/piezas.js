import { HERO_BASE } from '../lib/bases.js';

// Piezas para escribir las plantillas cortas. Los títulos en null usan el texto
// de siempre; los ids y los productos se completan al armarla (armar.js).
const b = (tipo, datos = {}) => ({ tipo, datos });

export const portada = (frase = null) =>
  b('hero', { ...structuredClone(HERO_BASE), frase });
export const beneficios = () => b('beneficios');
export const categorias = (forma, titulo = null) =>
  b('categorias', { titulo, forma, ids: [] });
export const club = () => b('club');
export const nosotros = (titulo = null) => b('nosotros', { titulo });
export const galeria = (titulo = null) => b('galeria', { titulo });
export const cierre = (titulo = null, texto = null) => b('cierre', { titulo, texto });
export const promo = (titulo = null) =>
  b('banner', { origen: 'promo', titulo, texto: null, boton: null, imagen: 'producto' });
export const texto = (titulo, cuerpo, alineacion = 'centro') =>
  b('texto', { titulo, cuerpo, alineacion });
export const destacado = (titulo = null, lado = 'izquierda') =>
  b('destacado', { productoId: null, titulo, texto: null, lado });

const productos =
  (vista, fuente, cantidad) =>
  (titulo, extra = {}) =>
    b('productos', {
      titulo,
      bajada: null,
      vista,
      fuente,
      cantidad,
      automatico: false,
      ...extra,
    });

// Carrusel de destacados, grilla de todo (el bloque al que lleva "Ver productos")
// y la categoría con más productos.
export const carrusel = productos('carrusel', { tipo: 'destacados' }, 12);
export const todo = productos('grilla', { tipo: 'todos' }, 48);
export const elegidos = productos('grilla', { tipo: 'destacados' }, 8);
export const deCategoria = productos('grilla', { tipo: 'categoria', id: null }, 8);
