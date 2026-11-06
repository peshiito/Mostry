import { DEFECTOS, nuevoId } from './defectos.js';

const mover = (lista, desde, hasta) => {
  const copia = [...lista];
  const [x] = copia.splice(desde, 1);
  copia.splice(hasta, 0, x);
  return copia;
};

const conBloque = (doc, id, cambio) => ({
  ...doc,
  bloques: doc.bloques.map((b) => (b.id === id ? cambio(b) : b)),
});

// Un cambio sobre la página. Devuelve un documento nuevo (nunca toca el anterior).
export function aplicar(doc, a) {
  const b = doc.bloques;
  switch (a.tipo) {
    case 'mover':
      return a.desde === a.hasta ? doc : { ...doc, bloques: mover(b, a.desde, a.hasta) };
    case 'agregar': {
      const nuevo = {
        id: nuevoId(),
        tipo: a.bloque,
        visible: true,
        datos: DEFECTOS[a.bloque](),
      };
      const lista = [...b];
      lista.splice(a.pos ?? lista.length, 0, nuevo);
      return { ...doc, bloques: lista };
    }
    case 'quitar':
      return { ...doc, bloques: b.filter((x) => x.id !== a.id) };
    case 'duplicar': {
      const i = b.findIndex((x) => x.id === a.id);
      if (i < 0) return doc;
      const lista = [...b];
      lista.splice(i + 1, 0, { ...structuredClone(b[i]), id: nuevoId() });
      return { ...doc, bloques: lista };
    }
    case 'alternar':
      return conBloque(doc, a.id, (x) => ({ ...x, visible: !x.visible }));
    case 'datos':
      return conBloque(doc, a.id, (x) => ({ ...x, datos: { ...x.datos, ...a.datos } }));
    case 'ajustes':
      return { ...doc, ajustes: { ...doc.ajustes, ...a.ajustes } };
    default:
      return doc;
  }
}
