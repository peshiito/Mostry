import { beforeEach, describe, expect, it } from 'vitest';
import { appConCuenta } from '../../../test/appConCuenta.js';
import { estadoApertura, type Agenda } from '../servicios/apertura.js';
import { ar } from './agendaDePrueba.js';

// "Las 24 horas" se guarda como el tramo 00:00–24:00 (sin minuto cerrado).
const dias = (lista: number[]) =>
  lista.map((diaSemana) => ({ diaSemana, abre: '00:00', cierra: '24:00' }));
const con = (tramos: Agenda['tramos'], feriados: string[] = []): Agenda => ({
  tramos,
  feriados: new Set(feriados),
  pausada: false,
});

describe('abierto las 24 horas', () => {
  const semana = con(dias([0, 1, 2, 3, 4, 5, 6]));

  it('toda la semana: abierta a las 23:59 y a las 00:00, sin hora de cierre', () => {
    for (const hora of ['2026-10-12T23:59', '2026-10-13T00:00', '2026-10-13T12:00']) {
      expect(estadoApertura(semana, ar(hora))).toEqual({ abierta: true, cierraA: null });
    }
  });

  it('un solo día de 24 h: cierra a la medianoche', () => {
    expect(estadoApertura(con(dias([1])), ar('2026-10-12T23:59'))).toEqual({
      abierta: true,
      cierraA: '24:00',
    });
  });

  it('si mañana es feriado, cierra a la medianoche de hoy', () => {
    expect(
      estadoApertura(con(dias([1, 2]), ['2026-10-13']), ar('2026-10-12T15:00')),
    ).toEqual({
      abierta: true,
      cierraA: '24:00',
    });
  });

  it('un feriado cierra aunque el día sea de 24 h', () => {
    expect(
      estadoApertura(con(dias([1]), ['2026-10-12']), ar('2026-10-12T10:00')),
    ).toMatchObject({
      abierta: false,
      motivo: 'feriado',
    });
  });

  describe('por la API', () => {
    let p: Awaited<ReturnType<typeof appConCuenta>>['panel'];
    beforeEach(async () => {
      ({ panel: p } = await appConCuenta());
    });

    it('guarda 00:00–24:00 y lo devuelve igual', async () => {
      await p.put('/panel/horarios', { tramos: dias([1, 2]) }).expect(200);
      expect((await p.get('/panel/horarios').expect(200)).body).toEqual(dias([1, 2]));
    });
  });
});
