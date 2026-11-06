import { describe, expect, it } from 'vitest';
import { REGISTRO } from '../bloques/registro.js';
import { botonesListos, enlace } from './destino.js';
import { plantillaDesdeTienda } from './plantilla.js';
import { productosDe } from './productosDe.js';

const tienda = { nombre: 'Doña Rosa', whatsapp: '5491122334455', contenido: null };

describe('Armá tu página', () => {
  it('sin página propia, arma la de siempre en bloques y en su orden', () => {
    const p = plantillaDesdeTienda({
      ...tienda,
      contenido: { secciones: [{ id: 'catalogo', visible: true, titulo: 'Facturas' }] },
    });
    const tipos = p.bloques.map((b) => b.tipo);
    expect(tipos[0]).toBe('hero');
    expect(tipos[1]).toBe('beneficios');
    expect(tipos.at(-1)).toBe('cierre');
    expect(p.bloques[2]).toMatchObject({
      id: 'productos',
      datos: { titulo: 'Facturas' },
    });
    for (const b of p.bloques) {
      expect(REGISTRO[b.tipo]).toBeDefined();
      expect(b.id).toMatch(/^[a-z0-9]{6,16}$/);
    }
  });

  it('los botones solo van a destinos seguros', () => {
    expect(enlace({ tipo: 'web', url: 'javascript:alert(1)' }, tienda)).toBeNull();
    expect(enlace({ tipo: 'web', url: 'http://x.com' }, tienda)).toBeNull();
    expect(enlace({ tipo: 'inventado' }, tienda)).toBeNull();
    expect(enlace({ tipo: 'producto', id: 4 }, tienda)).toMatchObject({
      href: '/producto/4',
      interno: true,
    });
    expect(enlace({ tipo: 'whatsapp' }, tienda).href).toMatch(/^https:\/\/wa\.me\//);
    const sinWa = botonesListos([{ texto: 'WA', destino: { tipo: 'whatsapp' } }], {});
    expect(sinWa).toEqual([]);
  });

  it('elige los productos según la fuente, en el orden pedido', () => {
    const c = {
      productos: [
        { id: 1, categoriaId: 7 },
        { id: 2, categoriaId: 8 },
        { id: 3, categoriaId: 7 },
      ],
      destacados: [{ id: 2 }],
    };
    expect(productosDe(c, { tipo: 'categoria', id: 7 }, 9).map((p) => p.id)).toEqual([
      1, 3,
    ]);
    expect(
      productosDe(c, { tipo: 'elegidos', ids: [3, 9, 1] }, 9).map((p) => p.id),
    ).toEqual([3, 1]);
    expect(productosDe(c, { tipo: 'todos' }, 2)).toHaveLength(2);
  });
});
