// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { encabezadosSitio, HSTS, redireccionHttps } from './seguridad.js';

const pedido = (extra) => ({
  proto: 'http',
  host: 'dona-rosa.mostry.com.ar',
  url: '/panel?x=1',
  dominio: 'mostry.com.ar',
  ...extra,
});

describe('servidor del frontend: https', () => {
  it('un pedido por http se manda a https, con la misma ruta', () => {
    expect(redireccionHttps(pedido())).toBe('https://dona-rosa.mostry.com.ar/panel?x=1');
    expect(redireccionHttps(pedido({ host: 'mostry.com.ar:80', url: '/' }))).toBe(
      'https://mostry.com.ar/',
    );
  });

  it('no redirige si ya es https, ni /salud, ni en local', () => {
    expect(redireccionHttps(pedido({ proto: 'https' }))).toBeNull();
    expect(redireccionHttps(pedido({ proto: undefined }))).toBeNull();
    expect(redireccionHttps(pedido({ url: '/salud' }))).toBeNull();
    expect(redireccionHttps(pedido({ dominio: 'mostry.localhost' }))).toBeNull();
  });

  it('nunca redirige a otro sitio aunque el Host venga cambiado', () => {
    expect(redireccionHttps(pedido({ host: 'malo.com' }))).toBeNull();
    expect(redireccionHttps(pedido({ host: 'mostry.com.ar.malo.com' }))).toBeNull();
    for (const url of ['@malo.com/x', '//malo.com/x', 'malo.com'])
      expect(redireccionHttps(pedido({ url }))).toBe('https://dona-rosa.mostry.com.ar/');
  });

  it('HSTS de 1 año sin preload, solo con un dominio real', () => {
    const base = { 'X-Frame-Options': 'DENY' };
    expect(encabezadosSitio(base, 'mostry.com.ar')).toEqual({
      ...base,
      'Strict-Transport-Security': HSTS,
    });
    expect(HSTS).toBe('max-age=31536000; includeSubDomains');
    expect(encabezadosSitio(base, 'mostry.localhost')).toEqual(base);
    expect(encabezadosSitio(base, undefined)).toEqual(base);
  });
});
