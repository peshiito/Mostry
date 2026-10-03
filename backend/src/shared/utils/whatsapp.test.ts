import { describe, expect, it } from 'vitest';
import { normalizarWhatsapp } from './whatsapp.js';

describe('normalizarWhatsapp', () => {
  it('lleva las formas habituales a 549 + área + número', () => {
    for (const entrada of [
      '11 2345-6789',
      '011 2345 6789',
      '+54 9 11 2345-6789',
      '54 11 2345 6789',
    ]) {
      expect(normalizarWhatsapp(entrada), entrada).toBe('5491123456789');
    }
    expect(normalizarWhatsapp('(0221) 456-7890')).toBe('5492214567890');
  });

  it('rechaza números incompletos o con el 15', () => {
    for (const entrada of ['2345-6789', '11 15 2345 6789', '15 2345 6789', 'hola', '']) {
      expect(normalizarWhatsapp(entrada), entrada).toBeNull();
    }
  });
});
