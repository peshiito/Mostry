import { describe, expect, it } from 'vitest';
import { zonaDesdeHost } from './zona.js';

describe('zonaDesdeHost', () => {
  const base = 'mostry.com.ar';
  it('resuelve las cuatro zonas', () => {
    expect(zonaDesdeHost('mostry.com.ar', base)).toEqual({ zona: 'sitio' });
    expect(zonaDesdeHost('www.mostry.com.ar', base)).toEqual({ zona: 'sitio' });
    expect(zonaDesdeHost('admin.mostry.com.ar', base)).toEqual({ zona: 'admin' });
    expect(zonaDesdeHost('LaEspiga.mostry.com.ar', base)).toEqual({
      zona: 'tienda',
      slug: 'laespiga',
    });
  });
  it('rechaza subdominios reservados, anidados y dominios ajenos', () => {
    expect(zonaDesdeHost('api.mostry.com.ar', base).zona).toBe('desconocida');
    expect(zonaDesdeHost('a.b.mostry.com.ar', base).zona).toBe('desconocida');
    expect(zonaDesdeHost('mostry.com.ar.evil.com', base).zona).toBe('desconocida');
  });
});
