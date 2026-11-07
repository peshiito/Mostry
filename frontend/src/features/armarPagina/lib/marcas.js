// Cuentas de la vista previa: qué bloque hay en un punto y dónde está cada uno.
// Se miden los rects (la tienda es `inert`: no recibe eventos ni sirve
// elementsFromPoint). Valen con el zoom de la compu porque son de pantalla.
const bloques = (pantalla) => pantalla.querySelectorAll('[data-id-bloque]');

export function bloqueEn(pantalla, x, y) {
  for (const b of bloques(pantalla)) {
    const r = b.getBoundingClientRect();
    if (x >= r.left && x < r.right && y >= r.top && y < r.bottom)
      return { id: b.dataset.idBloque, tipo: b.dataset.bloque };
  }
  return null;
}

// La caja de un bloque, relativa a la pantalla (para dibujar el contorno encima).
export function cajaDe(pantalla, id) {
  const b = [...bloques(pantalla)].find((x) => x.dataset.idBloque === id);
  if (!b) return null;
  const r = b.getBoundingClientRect();
  const p = pantalla.getBoundingClientRect();
  return {
    tipo: b.dataset.bloque,
    top: r.top - p.top,
    left: r.left - p.left,
    width: r.width,
    height: r.height,
  };
}

// Cuánto hay que bajar (o subir) la pantalla para que el bloque quede arriba.
export const desplazamiento = (pantalla, id) => {
  const c = cajaDe(pantalla, id);
  return c ? Math.max(0, pantalla.scrollTop + c.top - 8) : null;
};
