import { describe, expect, it } from 'vitest';
import { plantillaDesdeTienda } from '../../pagina/lib/plantilla.js';
import { editor } from './historial.js';

const inicio = () => editor(null, { tipo: 'cargar', doc: plantillaDesdeTienda({}) });
const tipos = (e) => e.doc.bloques.map((b) => b.tipo);

describe('editor de la página', () => {
  it('agrega, mueve, duplica, oculta y quita bloques', () => {
    let e = inicio();
    const n = e.doc.bloques.length;
    e = editor(e, { tipo: 'agregar', bloque: 'texto', pos: 1 });
    expect(tipos(e)[1]).toBe('texto');
    expect(e.doc.bloques[1].id).toMatch(/^[a-z0-9]{6,16}$/);
    e = editor(e, { tipo: 'mover', desde: 1, hasta: 0 });
    expect(tipos(e)[0]).toBe('texto');
    const id = e.doc.bloques[0].id;
    e = editor(e, { tipo: 'duplicar', id });
    expect(e.doc.bloques[1].id).not.toBe(id);
    e = editor(e, { tipo: 'alternar', id });
    expect(e.doc.bloques[0].visible).toBe(false);
    e = editor(e, { tipo: 'quitar', id });
    expect(e.doc.bloques).toHaveLength(n + 1);
  });

  it('deshace y rehace; escribir seguido en un campo es un solo paso', () => {
    let e = inicio();
    const original = e.doc;
    const id = e.doc.bloques[0].id;
    for (const titulo of ['H', 'Ho', 'Hola'])
      e = editor(e, { tipo: 'datos', id, datos: { titulo } });
    expect(e.antes).toHaveLength(1);
    e = editor(e, { tipo: 'deshacer' });
    expect(e.doc).toBe(original);
    e = editor(e, { tipo: 'rehacer' });
    expect(e.doc.bloques[0].datos.titulo).toBe('Hola');
  });

  it('poner una plantilla reemplaza la página y se puede deshacer', () => {
    let e = inicio();
    const original = e.doc;
    const doc = { ...original, bloques: [] };
    e = editor(e, { tipo: 'reemplazar', doc });
    expect(e.doc).toBe(doc);
    e = editor(e, { tipo: 'deshacer' });
    expect(e.doc).toBe(original);
  });
});
