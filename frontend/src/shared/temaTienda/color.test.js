import { describe, expect, it } from 'vitest';
import { ajustar, contraste, esHex, mezclar, textoSobre } from './color.js';

describe('color', () => {
  it('calcula el contraste WCAG', () => {
    expect(contraste('#000000', '#ffffff')).toBeCloseTo(21, 0);
    expect(contraste('#777777', '#ffffff')).toBeCloseTo(4.48, 1);
  });

  it('elige texto blanco o negro según el fondo', () => {
    expect(textoSobre('#0e5a4a')).toBe('#ffffff');
    expect(textoSobre('#f5e21b')).toBe('#161616');
  });

  it('ajusta un color claro hasta que se lea sobre fondo claro (y al revés)', () => {
    const amarillo = ajustar('#f5e21b', '#ffffff');
    expect(contraste(amarillo, '#ffffff')).toBeGreaterThanOrEqual(4.5);
    const azul = ajustar('#1d2c4d', '#141414');
    expect(contraste(azul, '#141414')).toBeGreaterThanOrEqual(4.5);
    expect(ajustar('#0e5a4a', '#ffffff')).toBe('#0e5a4a');
  });

  it('mezcla y valida hex', () => {
    expect(mezclar('#000000', '#ffffff', 0.5)).toBe('#808080');
    expect(esHex('#0E5a4a')).toBe(true);
    expect(esHex('red')).toBe(false);
  });
});
