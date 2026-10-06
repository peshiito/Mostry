import { describe, expect, it } from 'vitest';
import { aCentavos, plata } from './plata.js';

describe('plata', () => {
  it('formatea sin centavos cuando son cero', () => {
    expect(plata(780000)).toBe('$ 7.800');
    expect(plata(2800000)).toBe('$ 28.000');
  });
  it('muestra centavos cuando los hay', () => {
    expect(plata(780050)).toBe('$ 7.800,50');
  });
  it('convierte lo que escribe el usuario', () => {
    expect(aCentavos('7.800')).toBe(780000);
    expect(aCentavos('99,5')).toBe(9950);
    expect(aCentavos('abc')).toBeNull();
  });
});
