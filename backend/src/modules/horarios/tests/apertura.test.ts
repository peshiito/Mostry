import { describe, expect, it } from 'vitest';
import { estadoApertura } from '../servicios/apertura.js';
import { agenda, ar } from './agendaDePrueba.js';

describe('estadoApertura (hora argentina)', () => {
  it('abierta dentro de un tramo, con la hora de cierre', () => {
    expect(estadoApertura(agenda(), ar('2026-10-12T10:00'))).toEqual({
      abierta: true,
      cierraA: '13:00',
    });
  });

  it('el cierre es exclusivo y entre tramos avisa la próxima apertura del mismo día', () => {
    expect(estadoApertura(agenda(), ar('2026-10-12T13:00'))).toEqual({
      abierta: false,
      motivo: 'fuera_de_horario',
      proximaApertura: { fecha: '2026-10-12', hora: '16:30' },
    });
  });

  it('a la noche, la próxima apertura es mañana temprano', () => {
    const e = estadoApertura(agenda(), ar('2026-10-12T22:00'));
    expect(e).toMatchObject({
      abierta: false,
      proximaApertura: { fecha: '2026-10-13', hora: '07:00' },
    });
  });

  it('domingo cerrado; un feriado se saltea al buscar la próxima apertura', () => {
    const navidad = agenda({ feriados: new Set(['2026-12-25']) });
    expect(estadoApertura(navidad, ar('2026-12-25T10:00'))).toMatchObject({
      abierta: false,
      motivo: 'feriado',
      proximaApertura: { fecha: '2026-12-26', hora: '07:00' },
    });
    expect(estadoApertura(agenda(), ar('2026-10-11T10:00'))).toMatchObject({
      motivo: 'fuera_de_horario',
    });
  });
});
