import { beforeEach, describe, expect, it } from 'vitest';
import { appConCuenta } from '../../../test/appConCuenta.js';

const semana = [
  { diaSemana: 1, abre: '07:00', cierra: '13:00' },
  { diaSemana: 1, abre: '16:30', cierra: '20:30' },
  { diaSemana: 6, abre: '08:00', cierra: '12:00' },
];

describe('panel: horarios', () => {
  let p: Awaited<ReturnType<typeof appConCuenta>>['panel'];
  const guardar = (tramos: object[]) => p.put('/panel/horarios', { tramos });

  beforeEach(async () => {
    ({ panel: p } = await appConCuenta());
  });

  it('guarda la semana y la devuelve ordenada en HH:MM', async () => {
    await guardar([...semana].reverse()).expect(200);
    expect((await p.get('/panel/horarios').expect(200)).body).toEqual(semana);
  });

  it('reemplazar la semana borra los tramos anteriores', async () => {
    await guardar(semana).expect(200);
    await guardar([{ diaSemana: 3, abre: '09:00', cierra: '18:00' }]).expect(200);
    expect((await p.get('/panel/horarios')).body).toHaveLength(1);
    await guardar([]).expect(200);
    expect((await p.get('/panel/horarios')).body).toEqual([]);
  });

  it('rechaza tramos superpuestos, que cruzan la medianoche o con horas inválidas', async () => {
    const malos = [
      [
        { diaSemana: 1, abre: '08:00', cierra: '13:00' },
        { diaSemana: 1, abre: '12:00', cierra: '18:00' },
      ],
      [{ diaSemana: 5, abre: '20:00', cierra: '02:00' }],
      [{ diaSemana: 1, abre: '24:00', cierra: '25:00' }],
      [{ diaSemana: 7, abre: '08:00', cierra: '09:00' }],
      [{ diaSemana: 1, abre: '8:00', cierra: '9:00' }],
      Array.from({ length: 5 }, (_, i) => ({
        diaSemana: 2,
        abre: `0${i}:00`,
        cierra: `0${i}:30`,
      })),
    ];
    for (const tramos of malos) await guardar(tramos).expect(400);
    expect((await p.get('/panel/horarios')).body).toEqual([]);
  });

  it('el estado dice cerrada si no hay horarios, y pausada si la pausan', async () => {
    expect((await p.get('/panel/horarios/estado').expect(200)).body).toMatchObject({
      abierta: false,
    });
    await p.put('/panel/tienda/pausa', { pausada: true }).expect(200);
    expect((await p.get('/panel/horarios/estado')).body).toEqual({
      abierta: false,
      motivo: 'pausada',
      proximaApertura: null,
    });
  });
});
