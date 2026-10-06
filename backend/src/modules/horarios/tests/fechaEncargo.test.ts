import { describe, expect, it } from 'vitest';
import type { Agenda } from '../servicios/apertura.js';
import { problemaFechaEncargo } from '../servicios/fechaEncargo.js';

const ar = (fechaHora: string) => new Date(`${fechaHora}:00-03:00`);
const agenda: Agenda = {
  tramos: [1, 2, 3, 4, 5, 6].map((diaSemana) => ({
    diaSemana,
    abre: '08:00',
    cierra: '20:00',
  })),
  feriados: new Set(['2026-10-14']),
  pausada: false,
};
const ahora = ar('2026-10-12T10:00'); // lunes

describe('fecha de un encargo', () => {
  it('válida: dentro del horario y con la anticipación cumplida', () => {
    expect(problemaFechaEncargo(agenda, 24, ar('2026-10-13T11:00'), ahora)).toBeNull();
  });

  it('rechaza el pasado y la falta de anticipación', () => {
    expect(problemaFechaEncargo(agenda, 24, ar('2026-10-12T09:00'), ahora)).toBe(
      'pasado',
    );
    expect(problemaFechaEncargo(agenda, 24, ar('2026-10-13T09:59'), ahora)).toBe(
      'anticipacion',
    );
  });

  it('rechaza feriados, domingos, horas fuera de tramo y más de 60 días', () => {
    expect(problemaFechaEncargo(agenda, 0, ar('2026-10-14T11:00'), ahora)).toBe(
      'feriado_o_fuera_de_horario',
    );
    expect(problemaFechaEncargo(agenda, 0, ar('2026-10-18T11:00'), ahora)).toBe(
      'feriado_o_fuera_de_horario',
    );
    expect(problemaFechaEncargo(agenda, 0, ar('2026-10-13T20:00'), ahora)).toBe(
      'feriado_o_fuera_de_horario',
    );
    expect(problemaFechaEncargo(agenda, 0, ar('2026-12-20T11:00'), ahora)).toBe(
      'muy_lejos',
    );
  });
});
