import { describe, expect, it } from 'vitest';
import { estadoApertura, type Agenda } from '../servicios/apertura.js';
import { ar } from './agendaDePrueba.js';

const con = (tramos: Agenda['tramos'], feriados: string[] = []): Agenda => ({
  tramos,
  feriados: new Set(feriados),
  pausada: false,
});

// Estos casos dan distinto si por error se usara UTC en vez de hora argentina.
describe('bordes de la hora argentina', () => {
  it('lunes 23:30 en Argentina (ya martes en UTC) sigue abierta hasta medianoche', () => {
    const noche = con([{ diaSemana: 1, abre: '20:00', cierra: '24:00' }]);
    expect(new Date('2026-10-13T02:30:00Z')).toEqual(ar('2026-10-12T23:30'));
    expect(estadoApertura(noche, ar('2026-10-12T23:30'))).toEqual({
      abierta: true,
      cierraA: '24:00',
    });
  });

  it('el feriado empieza y termina a la medianoche argentina, no la UTC', () => {
    const agenda = con(
      [4, 5].map((diaSemana) => ({ diaSemana, abre: '00:00', cierra: '24:00' })),
      ['2026-12-25'],
    );
    expect(estadoApertura(agenda, ar('2026-12-24T22:00')).abierta).toBe(true); // 25/12 01:00 UTC
    expect(estadoApertura(agenda, ar('2026-12-25T23:00'))).toMatchObject({
      motivo: 'feriado',
    }); // 26/12 UTC
  });

  it('tramos pegados se unen: 08–13 y 13–18 cierra a las 18:00', () => {
    const corrido = con([
      { diaSemana: 1, abre: '08:00', cierra: '13:00' },
      { diaSemana: 1, abre: '13:00', cierra: '18:00' },
    ]);
    expect(estadoApertura(corrido, ar('2026-10-12T10:00'))).toEqual({
      abierta: true,
      cierraA: '18:00',
    });
  });

  it('viernes 20–24 + sábado 00–02: a las 23:00 dice que cierra a las 02:00', () => {
    const pizzeria = con([
      { diaSemana: 5, abre: '20:00', cierra: '24:00' },
      { diaSemana: 6, abre: '00:00', cierra: '02:00' },
    ]);
    expect(estadoApertura(pizzeria, ar('2026-10-16T23:00'))).toEqual({
      abierta: true,
      cierraA: '02:00',
    });
    expect(estadoApertura(pizzeria, ar('2026-10-17T01:00'))).toEqual({
      abierta: true,
      cierraA: '02:00',
    });
  });
});
