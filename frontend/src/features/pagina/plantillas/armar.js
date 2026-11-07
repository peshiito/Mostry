import { AJUSTES_BASE } from '../lib/bases.js';
import { plantilla } from './index.js';

const id = () => `b${Math.random().toString(36).slice(2, 10)}`.padEnd(8, '0');

const masProductos = (cats) =>
  cats.reduce((a, c) => (!a || c.cantidad > a.cantidad ? c : a), null);

// Completa lo que depende de la tienda. Devuelve null si el bloque no tiene
// sentido sin datos (un destacado en una tienda sin productos).
function completar(bloque, { productos = [], destacados = [], categorias = [] }) {
  const datos = structuredClone(bloque.datos);
  if (bloque.tipo === 'destacado') {
    const elegido = destacados[0] ?? productos[0];
    if (!elegido) return null;
    datos.productoId = elegido.id;
  }
  if (datos.fuente?.tipo === 'categoria') {
    const cat = masProductos(categorias);
    datos.fuente = cat ? { tipo: 'categoria', id: cat.id } : { tipo: 'destacados' };
  }
  return { ...bloque, datos };
}

// El documento de una plantilla, listo para el editor: ids nuevos, los ajustes
// que ya tenía la tienda y el bloque principal de productos (el de todos, o el
// primero) con id "productos": a ese apunta el botón "Ver productos" de la portada.
export function armarPlantilla(clave, { catalogo = {}, ajustes = AJUSTES_BASE } = {}) {
  const p = plantilla(clave);
  if (!p) return null;
  const bloques = p.bloques.map((b) => completar(b, catalogo)).filter(Boolean);
  const esProductos = (b) => b.tipo === 'productos';
  const todos = bloques.findIndex(
    (b) => esProductos(b) && b.datos.fuente.tipo === 'todos',
  );
  const principal = todos >= 0 ? todos : bloques.findIndex(esProductos);
  bloques.forEach((b, i) => {
    Object.assign(b, { id: i === principal ? 'productos' : id(), visible: true });
  });
  return { version: 1, ajustes: structuredClone(ajustes), bloques };
}
