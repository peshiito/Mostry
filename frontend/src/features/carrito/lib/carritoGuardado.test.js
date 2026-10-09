import { afterEach, describe, expect, it } from 'vitest';
import { leerCarrito } from './carritoGuardado.js';

const guardar = (v) =>
  sessionStorage.setItem('c', typeof v === 'string' ? v : JSON.stringify(v));
const bueno = { id: 3, nombre: 'Medialuna', precio: 40000, cantidad: 2, foto: '/a.webp' };

describe('leerCarrito', () => {
  afterEach(() => sessionStorage.clear());

  it('devuelve el carrito guardado si está bien', () => {
    guardar([bueno]);
    expect(leerCarrito('c')).toEqual([
      { ...bueno, descripcion: '', aceptaEncargo: false },
    ]);
  });

  it('sin carrito, JSON roto o algo que no es lista → vacío', () => {
    expect(leerCarrito('c')).toEqual([]);
    for (const v of ['{roto', '{}', '"hola"', '42', 'null']) {
      guardar(v);
      expect(leerCarrito('c')).toEqual([]);
    }
  });

  it('descarta ítems con tipos o valores que no corresponden', () => {
    guardar([
      bueno,
      null,
      { ...bueno, id: '3' },
      { ...bueno, cantidad: 0 },
      { ...bueno, cantidad: 1.5 },
      { ...bueno, precio: -1 },
      { ...bueno, nombre: { x: 1 } },
    ]);
    expect(leerCarrito('c').map((i) => i.id)).toEqual([3]);
  });

  it('una foto que no es ruta propia ni https se cambia por "sin foto"', () => {
    for (const foto of ['javascript:alert(1)', 'data:image/svg+xml,x', '//otro.com/a']) {
      guardar([{ ...bueno, foto }]);
      expect(leerCarrito('c')[0].foto).toBe('/sin-foto.svg');
    }
  });
});
