// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { AJUSTES_BASE } from '../lib/bases.js';
import { armarPlantilla } from './armar.js';
import { PLANTILLAS } from './index.js';
import { plantillaSugerida } from './sugerida.js';

const catalogo = {
  productos: [{ id: 7 }, { id: 9 }],
  destacados: [{ id: 9 }],
  categorias: [
    { id: 3, cantidad: 2 },
    { id: 5, cantidad: 6 },
  ],
};

describe('plantillas por estilo', () => {
  it('hay una por cada estilo más la de cero, todas con productos', () => {
    expect(PLANTILLAS).toHaveLength(12);
    for (const p of PLANTILLAS) {
      const doc = armarPlantilla(p.clave, { catalogo });
      const ids = doc.bloques.map((b) => b.id);
      expect(new Set(ids).size).toBe(ids.length);
      expect(ids).toContain('productos');
      expect(ids.every((x) => /^[a-z0-9]{6,16}$/.test(x))).toBe(true);
    }
  });

  it('completa el destacado y la categoría con lo que hay en la tienda', () => {
    const doc = armarPlantilla('bodega', { catalogo });
    expect(doc.bloques.find((b) => b.tipo === 'destacado').datos.productoId).toBe(9);
    const cocina = armarPlantilla('cocina', { catalogo });
    const prods = cocina.bloques.filter((b) => b.tipo === 'productos');
    expect(
      prods.every((b) => b.datos.fuente.tipo !== 'categoria' || b.datos.fuente.id),
    ).toBe(true);
  });

  it('sin productos saca el destacado y conserva los ajustes', () => {
    const ajustes = { ...AJUSTES_BASE, carrito: false };
    const doc = armarPlantilla('street', { ajustes });
    expect(doc.bloques.some((b) => b.tipo === 'destacado')).toBe(false);
    expect(doc.ajustes.carrito).toBe(false);
    expect(armarPlantilla('nada')).toBeNull();
  });

  it('sugiere la del estilo, si no la del rubro, si no ninguna', () => {
    expect(plantillaSugerida({ tema: { base: 'dulce' } }).nombre).toBe('Heladería');
    expect(plantillaSugerida({ tema: { base: 'calle' } }).clave).toBe('street');
    expect(plantillaSugerida({ tema: null, rubro: 'panaderia' }).clave).toBe('horno');
    expect(plantillaSugerida({ tema: { base: 'toldo' }, rubro: 'ropa' }).clave).toBe(
      'street',
    );
    expect(plantillaSugerida({ rubro: 'otro' })).toBeNull();
  });
});
