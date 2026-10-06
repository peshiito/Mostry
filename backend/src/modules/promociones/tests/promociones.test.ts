import { beforeEach, describe, expect, it } from 'vitest';
import { appConCuenta } from '../../../test/appConCuenta.js';

const enHoras = (h: number) => new Date(Date.now() + h * 3_600_000).toISOString();

describe('panel: promociones', () => {
  let p: Awaited<ReturnType<typeof appConCuenta>>['panel'];

  beforeEach(async () => {
    ({ panel: p } = await appConCuenta());
  });

  it('crea, edita y desactiva (no se borran)', async () => {
    const { body } = await p
      .post('/panel/promociones', {
        titulo: '2x1',
        desde: enHoras(0),
        hasta: enHoras(48),
      })
      .expect(201);
    expect(body).toMatchObject({ titulo: '2x1', activa: true });
    await p.patch(`/panel/promociones/${body.id}`, { activa: false }).expect(200);
    expect((await p.get('/panel/promociones')).body[0].activa).toBe(false);
  });

  it('valida fechas: rango invertido, ya vencida o sin zona horaria', async () => {
    await p
      .post('/panel/promociones', { titulo: 'x1', desde: enHoras(5), hasta: enHoras(1) })
      .expect(400);
    await p
      .post('/panel/promociones', {
        titulo: 'x2',
        desde: enHoras(-48),
        hasta: enHoras(-1),
      })
      .expect(400);
    await p
      .post('/panel/promociones', {
        titulo: 'x3',
        desde: '2026-12-01T10:00:00',
        hasta: '2026-12-02T10:00:00',
      })
      .expect(400);
    const { body } = await p.post('/panel/promociones', {
      titulo: 'ok',
      desde: enHoras(0),
      hasta: enHoras(5),
    });
    await p.patch(`/panel/promociones/${body.id}`, { hasta: enHoras(-10) }).expect(400);
  });
});
