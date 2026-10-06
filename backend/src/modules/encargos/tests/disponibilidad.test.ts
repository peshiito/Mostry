import { describe, expect, it } from 'vitest';
import type { Agenda } from '../../horarios/servicios/apertura.js';
import { disponibilidadEncargo } from '../disponibilidad.js';

const ar = (fechaHora: string) => new Date(`${fechaHora}:00-03:00`);
const agenda = (extra: Partial<Agenda> = {}): Agenda => ({
  tramos: [
    { diaSemana: 2, abre: '08:00', cierra: '13:00' },
    { diaSemana: 2, abre: '16:00', cierra: '20:00' },
  ],
  feriados: new Set(),
  pausada: false,
  ...extra,
});
const ahora = ar('2026-10-12T10:00'); // lunes; el martes 13 tiene dos tramos

describe('disponibilidad de encargos', () => {
  it('con 24 h de anticipación, el martes arranca a las 10:00 (recorta el primer tramo)', () => {
    expect(disponibilidadEncargo(agenda(), '2026-10-13', 24, ahora)).toEqual({
      fecha: '2026-10-13',
      disponible: true,
      motivo: null,
      tramos: [
        { abre: '10:00', cierra: '13:00' },
        { abre: '16:00', cierra: '20:00' },
      ],
    });
  });

  it('si la anticipación pasa todo el día, no hay horarios', () => {
    expect(disponibilidadEncargo(agenda(), '2026-10-13', 48, ahora)).toMatchObject({
      disponible: false,
      motivo: 'anticipacion',
    });
  });

  it('feriado, pausada, día sin tramos y más de 60 días', () => {
    expect(
      disponibilidadEncargo(
        agenda({ feriados: new Set(['2026-10-13']) }),
        '2026-10-13',
        0,
        ahora,
      ).motivo,
    ).toBe('feriado');
    expect(
      disponibilidadEncargo(agenda({ pausada: true }), '2026-10-13', 0, ahora).motivo,
    ).toBe('pausada');
    expect(disponibilidadEncargo(agenda(), '2026-10-14', 0, ahora).motivo).toBe(
      'cerrado',
    );
    expect(disponibilidadEncargo(agenda(), '2026-12-29', 0, ahora).motivo).toBe(
      'muy_lejos',
    );
  });
});
