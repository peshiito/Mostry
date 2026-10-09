import { describe, expect, it } from 'vitest';
import { esLinkWhatsapp, linkWhatsapp } from './linkSeguro.js';

describe('links de WhatsApp', () => {
  it('del número quedan solo los dígitos y el texto va codificado', () => {
    expect(linkWhatsapp('+54 9 11 2345-6789')).toBe('https://wa.me/5491123456789');
    expect(linkWhatsapp('5491123456789?text=hola#x', 'Pagué $ 100 & listo')).toBe(
      'https://wa.me/5491123456789?text=Pagu%C3%A9%20%24%20100%20%26%20listo',
    );
  });

  it('sin un número válido no hay link', () => {
    for (const malo of [null, '', 'abc', '123', '1'.repeat(16)])
      expect(linkWhatsapp(malo)).toBeNull();
  });

  it('el link de la API solo vale si es https y de wa.me', () => {
    expect(esLinkWhatsapp('https://wa.me/549111?text=hola')).toContain('https://wa.me/');
    for (const malo of [
      'http://wa.me/1',
      'https://wa.me.evil.com/1',
      'ftp://wa.me/1',
      'nada',
    ])
      expect(esLinkWhatsapp(malo)).toBeNull();
  });
});
