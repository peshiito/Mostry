import { afterEach, describe, expect, it } from 'vitest';
import { almacenTema, elegirTema, resolver } from './tema.js';

describe('tema', () => {
  afterEach(() => elegirTema('sistema'));

  it('"sistema" sigue al dispositivo; claro y oscuro se imponen', () => {
    expect(resolver('sistema', true)).toBe('oscuro');
    expect(resolver('sistema', false)).toBe('claro');
    expect(resolver('claro', true)).toBe('claro');
    expect(resolver('oscuro', false)).toBe('oscuro');
  });

  it('elegir un modo lo aplica en <html> y lo recuerda', () => {
    elegirTema('oscuro');
    expect(document.documentElement.dataset.tema).toBe('oscuro');
    expect(localStorage.getItem('mostry:tema')).toBe('oscuro');
    expect(almacenTema.leer()).toBe('oscuro');
  });

  it('volver a automático borra la preferencia guardada', () => {
    elegirTema('claro');
    elegirTema('sistema');
    expect(localStorage.getItem('mostry:tema')).toBeNull();
    expect(document.documentElement.dataset.tema).toBe('claro'); // jsdom = sistema claro
  });
});
