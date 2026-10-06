import { describe, expect, it } from 'vitest';
import { diasDelMes, horaTexto, turnosDelDia } from './agenda.js';

const TRAMOS = { 3: [['07:00', '08:00']] }; // miércoles

describe('agenda', () => {
  it('arma la grilla del mes empezando el lunes', () => {
    const dias = diasDelMes(2026, 9); // octubre 2026 arranca jueves
    expect(dias.slice(0, 3)).toEqual([null, null, null]);
    expect(dias.filter(Boolean)).toHaveLength(31);
  });
  it('respeta tramos, anticipación y feriados', () => {
    const mie = new Date(2026, 9, 14);
    const ahora = new Date(2026, 9, 11, 7, 30);
    expect(turnosDelDia(mie, TRAMOS, [], 48, ahora).map(horaTexto)).toEqual([
      '07:00',
      '07:30',
    ]);
    expect(turnosDelDia(mie, TRAMOS, [], 72, ahora).map(horaTexto)).toEqual(['07:30']);
    expect(turnosDelDia(mie, TRAMOS, ['2026-10-14'], 48, ahora)).toEqual([]);
  });
});
