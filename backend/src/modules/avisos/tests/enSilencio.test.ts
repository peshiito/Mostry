import { describe, expect, it } from 'vitest';
import { enSilencio } from '../silencio.js';

// 12:00 UTC = 09:00 en Argentina.
const aLas = (h: number, m = 0) => new Date(Date.UTC(2026, 9, 16, h + 3, m));

describe('enSilencio', () => {
  it('sin horario, nunca', () => {
    expect(enSilencio(null, null, aLas(3))).toBe(false);
  });
  it('un horario que cruza la medianoche (23 a 7)', () => {
    expect(enSilencio('23:00', '07:00', aLas(23, 30))).toBe(true);
    expect(enSilencio('23:00', '07:00', aLas(3))).toBe(true);
    expect(enSilencio('23:00', '07:00', aLas(7))).toBe(false);
    expect(enSilencio('23:00', '07:00', aLas(12))).toBe(false);
  });
  it('un horario del mismo día (13 a 16, la siesta)', () => {
    expect(enSilencio('13:00', '16:00', aLas(14))).toBe(true);
    expect(enSilencio('13:00', '16:00', aLas(16, 30))).toBe(false);
  });
});
