import { describe, expect, it } from 'vitest';
import type { Agenda } from '../servicios/apertura.js';
import { problemaFechaEncargo } from '../servicios/fechaEncargo.js';
import { agenda as agendaRosa, ar } from './agendaDePrueba.js';

const HORA = 3_600_000;
const abierta24h: Agenda = {
  tramos: [0, 1, 2, 3, 4, 5, 6].map((diaSemana) => ({
    diaSemana,
    abre: '00:00',
    cierra: '24:00',
  })),
  feriados: new Set(),
  pausada: false,
};
const ahora = ar('2026-10-12T10:00');

describe('fecha de encargo: límites exactos', () => {
  it('justo con la anticipación mínima se acepta; un instante antes, no', () => {
    expect(
      problemaFechaEncargo(abierta24h, 24, new Date(ahora.getTime() + 24 * HORA), ahora),
    ).toBeNull();
    expect(
      problemaFechaEncargo(
        abierta24h,
        24,
        new Date(ahora.getTime() + 24 * HORA - 1),
        ahora,
      ),
    ).toBe('anticipacion');
    expect(problemaFechaEncargo(abierta24h, 0, ahora, ahora)).toBe('pasado');
  });

  it('justo 60 días se acepta; un milisegundo más, no', () => {
    const sesenta = new Date(ahora.getTime() + 60 * 24 * HORA);
    expect(problemaFechaEncargo(abierta24h, 0, sesenta, ahora)).toBeNull();
    expect(
      problemaFechaEncargo(abierta24h, 0, new Date(sesenta.getTime() + 1), ahora),
    ).toBe('muy_lejos');
  });

  it('entre tramos se rechaza; en la apertura de la tarde se acepta', () => {
    expect(problemaFechaEncargo(agendaRosa(), 0, ar('2026-10-13T14:00'), ahora)).toBe(
      'feriado_o_fuera_de_horario',
    );
    expect(
      problemaFechaEncargo(agendaRosa(), 0, ar('2026-10-13T16:30'), ahora),
    ).toBeNull();
  });

  it('con la tienda pausada no acepta encargos (decisión 20)', () => {
    expect(
      problemaFechaEncargo(
        { ...abierta24h, pausada: true },
        0,
        ar('2026-10-13T11:00'),
        ahora,
      ),
    ).toBe('pausada');
  });
});
