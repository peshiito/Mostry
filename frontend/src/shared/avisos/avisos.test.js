import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { almacenAvisos, avisar, cerrarAviso } from './avisos.js';
import { ubicar } from './pila.js';

describe('avisos', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    almacenAvisos.leer().forEach((a) => cerrarAviso(a.id));
    vi.runAllTimers();
    vi.useRealTimers();
  });

  it('el más nuevo va adelante y quedan como máximo 3 activos', () => {
    ['Uno', 'Dos', 'Tres', 'Cuatro'].forEach((t) => avisar.exito(t));
    const activos = almacenAvisos.leer().filter((a) => !a.saliendo);
    expect(activos.map((a) => a.titulo)).toEqual(['Cuatro', 'Tres', 'Dos']);
    vi.runAllTimers();
    expect(almacenAvisos.leer()).toHaveLength(3);
  });

  it('cerrar lo marca para salir y después lo saca', () => {
    const id = avisar.error('Ups');
    cerrarAviso(id);
    expect(almacenAvisos.leer()[0].saliendo).toBe(true);
    vi.advanceTimersByTime(300);
    expect(almacenAvisos.leer()).toHaveLength(0);
  });
});

describe('ubicar (pila de avisos)', () => {
  const lista = [{ id: 3 }, { id: 2, saliendo: true }, { id: 1 }];
  const alturas = { 3: 60, 2: 50, 1: 80 };

  it('cerrada: alto del de adelante + 12 px por cada uno de atrás', () => {
    const r = ubicar(lista, alturas, false);
    expect(r.altoFrente).toBe(60);
    expect(r.alto).toBe(72);
    expect(r.posiciones.map((p) => p.indice)).toEqual([0, 0, 1]);
  });

  it('abierta: cada uno se corre la suma de los de adelante (sin los que salen)', () => {
    const r = ubicar(lista, alturas, true);
    expect(r.posiciones.map((p) => p.desplazo)).toEqual([0, 72, 72]);
    expect(r.alto).toBe(72 + 92);
  });
});
