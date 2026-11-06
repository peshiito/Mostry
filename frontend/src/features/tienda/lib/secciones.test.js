import { describe, expect, it } from 'vitest';
import { ordenSecciones } from './secciones.js';

describe('orden de las secciones', () => {
  it('sin nada guardado, el orden de siempre y todas visibles', () => {
    const s = ordenSecciones();
    expect(s.map((x) => x.id)).toEqual([
      'promo',
      'categorias',
      'destacados',
      'club',
      'catalogo',
      'nosotros',
      'galeria',
      'envios',
    ]);
    expect(s.every((x) => x.visible)).toBe(true);
  });

  it('respeta el orden guardado y agrega al final las que faltan', () => {
    const s = ordenSecciones([
      { id: 'catalogo', visible: true, titulo: 'Nuestros panes' },
      { id: 'promo', visible: false },
      { id: 'inventada', visible: true },
    ]);
    expect(s.slice(0, 3).map((x) => x.id)).toEqual(['catalogo', 'promo', 'categorias']);
    expect(s[0].titulo).toBe('Nuestros panes');
    expect(s).toHaveLength(8);
  });
});
