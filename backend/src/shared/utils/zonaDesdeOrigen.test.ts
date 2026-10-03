import { describe, expect, it } from 'vitest';
import { esSlugValido, zonaDesdeOrigen } from './zonaDesdeOrigen.js';

const prod = (o: string | undefined) => zonaDesdeOrigen(o, 'mostry.com.ar', 'https');

describe('zonaDesdeOrigen', () => {
  it('reconoce sitio, admin y tienda', () => {
    expect(prod('https://mostry.com.ar')).toEqual({ tipo: 'sitio' });
    expect(prod('https://www.mostry.com.ar')).toEqual({ tipo: 'sitio' });
    expect(prod('https://admin.mostry.com.ar')).toEqual({ tipo: 'admin' });
    expect(prod('https://heladeria.mostry.com.ar')).toEqual({
      tipo: 'tienda',
      slug: 'heladeria',
    });
  });

  it('pasa el subdominio a minúscula', () => {
    expect(prod('https://Computacion.mostry.com.ar')).toBeNull(); // Origin no es canónico
    expect(prod(new URL('https://Computacion.mostry.com.ar').origin)).toEqual({
      tipo: 'tienda',
      slug: 'computacion',
    });
  });

  it('rechaza orígenes ajenos o mal formados', () => {
    for (const o of [
      undefined,
      'null',
      'http://heladeria.mostry.com.ar',
      'https://heladeria.mostry.com.ar:8443',
      'https://mostry.com.ar.evil.com',
      'https://evilmostry.com.ar',
      'https://a.b.mostry.com.ar',
      'https://api.mostry.com.ar',
      'https://panel.mostry.com.ar',
      'https://heladeria.mostry.com.ar/ruta',
    ]) {
      expect(prod(o), String(o)).toBeNull();
    }
  });

  it('acepta puertos en desarrollo con http', () => {
    const dev = zonaDesdeOrigen('http://heladeria.localhost:5173', 'localhost', 'http');
    expect(dev).toEqual({ tipo: 'tienda', slug: 'heladeria' });
  });
});

describe('esSlugValido', () => {
  it('valida largo, caracteres, guiones y reservados', () => {
    expect(esSlugValido('dona-rosa')).toBe(true);
    expect(esSlugValido('abc')).toBe(true);
    expect(esSlugValido('ab')).toBe(false);
    expect(esSlugValido('a'.repeat(31))).toBe(false);
    expect(esSlugValido('-rosa')).toBe(false);
    expect(esSlugValido('rosa-')).toBe(false);
    expect(esSlugValido('xn--rosa')).toBe(false);
    expect(esSlugValido('doña')).toBe(false);
    expect(esSlugValido('www')).toBe(false);
  });
});
