import { describe, expect, it } from 'vitest';
import { almacenProgreso, iniciarTarea } from './progreso.js';

const leer = () => almacenProgreso.leer();

describe('progreso de carga', () => {
  it('avanza por tareas terminadas y se reinicia al terminar todas', () => {
    const a = iniciarTarea();
    const b = iniciarTarea();
    const c = iniciarTarea();
    expect(leer()).toEqual({ activa: true, valor: 0 });
    a();
    b();
    expect(leer().valor).toBeCloseTo(2 / 3);
    c();
    expect(leer()).toEqual({ activa: false, valor: 1 });
    const d = iniciarTarea();
    expect(leer()).toEqual({ activa: true, valor: 0 });
    d();
  });

  it('terminar dos veces la misma tarea no la cuenta doble', () => {
    const a = iniciarTarea();
    const b = iniciarTarea();
    a();
    a();
    expect(leer()).toEqual({ activa: true, valor: 0.5 });
    b();
    expect(leer().activa).toBe(false);
  });

  it('avisa a los suscriptos en cada cambio', () => {
    let avisos = 0;
    const salir = almacenProgreso.suscribir(() => (avisos += 1));
    iniciarTarea()();
    salir();
    expect(avisos).toBe(2);
  });
});
