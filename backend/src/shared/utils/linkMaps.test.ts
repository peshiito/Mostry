import { describe, expect, it } from 'vitest';
import { esLinkMapsValido } from './linkMaps.js';

describe('esLinkMapsValido', () => {
  it('acepta los links que comparte Google Maps', () => {
    for (const link of [
      'https://maps.app.goo.gl/AbCdEf123',
      'https://www.google.com/maps/place/Lan%C3%BAs',
      'https://maps.google.com/?q=-34.7,-58.39',
      'https://goo.gl/maps/xyz',
      'https://www.google.com.ar/maps/@-34.7,-58.39,15z',
    ]) {
      expect(esLinkMapsValido(link), link).toBe(true);
    }
  });

  it('rechaza javascript:, http, otros dominios y trucos con usuario o puerto', () => {
    for (const link of [
      'javascript:alert(1)',
      'http://maps.app.goo.gl/x',
      'https://maps.app.goo.gl.evil.com/x',
      'https://evil.com/maps',
      'https://www.google.com/search?q=maps',
      'https://www.google.com@evil.com/maps',
      'https://maps.google.com:8443/x',
      'no es un link',
    ]) {
      expect(esLinkMapsValido(link), link).toBe(false);
    }
  });
});
