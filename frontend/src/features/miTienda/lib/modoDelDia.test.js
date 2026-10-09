import { describe, expect, it } from 'vitest';
import { TODO_EL_DIA, TRAMOS_DEL_MODO, errorTramos, modoDelDia } from './tramos.js';

describe('modo de cada día', () => {
  it('distingue cerrado, con horario y 24 horas', () => {
    expect(modoDelDia([])).toBe('cerrado');
    expect(modoDelDia([['08:00', '13:00']])).toBe('horario');
    expect(modoDelDia([TODO_EL_DIA])).toBe('24h');
    expect(
      modoDelDia([
        ['00:00', '12:00'],
        ['12:00', '24:00'],
      ]),
    ).toBe('horario');
  });

  it('cada modo arranca con tramos válidos', () => {
    for (const tramos of Object.values(TRAMOS_DEL_MODO)) {
      expect(errorTramos(tramos)).toBeNull();
    }
    expect(modoDelDia(TRAMOS_DEL_MODO['24h'])).toBe('24h');
  });
});
