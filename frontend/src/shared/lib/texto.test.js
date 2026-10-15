import { describe, expect, it } from 'vitest';
import { whatsappLocal } from './texto.js';

describe('whatsappLocal', () => {
  it('muestra el número guardado como lo escribe la gente', () => {
    expect(whatsappLocal('5491155551234')).toBe('1155551234');
    expect(whatsappLocal('5493511234567')).toBe('3511234567');
    expect(whatsappLocal(null)).toBe('');
    expect(whatsappLocal('123')).toBe('123');
  });
});
