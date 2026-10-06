import type { Agenda } from '../servicios/apertura.js';

// Argentina es UTC−3: las 10:00 de Buenos Aires son las 13:00 UTC.
export const ar = (fechaHora: string) => new Date(`${fechaHora}:00-03:00`);

// Lunes a sábado 7–13 y lunes a viernes 16:30–20:30 (como Doña Rosa).
export const agenda = (extra: Partial<Agenda> = {}): Agenda => ({
  tramos: [
    ...[1, 2, 3, 4, 5, 6].map((diaSemana) => ({
      diaSemana,
      abre: '07:00',
      cierra: '13:00',
    })),
    ...[1, 2, 3, 4, 5].map((diaSemana) => ({
      diaSemana,
      abre: '16:30',
      cierra: '20:30',
    })),
  ],
  feriados: new Set(),
  pausada: false,
  ...extra,
});
