import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { enArgentina } from '../../../shared/utils/horaArgentina.js';
import { appConCuenta } from '../../../test/appConCuenta.js';

describe('caja que quedó abierta de otro día (decisión 35)', () => {
  let p: Awaited<ReturnType<typeof appConCuenta>>['panel'];
  const ayer = enArgentina(new Date(Date.now() - 86_400_000)).fecha;

  beforeEach(async () => {
    ({ panel: p } = await appConCuenta());
    const { id } = (await p.get('/panel/tienda/config')).body;
    await db
      .insertInto('cajas')
      .values({ tiendaId: id, fecha: ayer, montoApertura: 0, abiertaEn: new Date() })
      .execute();
  });

  it('pide cerrarla antes de abrir la de hoy, y no deja cargar efectivo en ella', async () => {
    const res = await p.post('/panel/caja/abrir', { montoApertura: 0 }).expect(409);
    expect(res.body.error).toMatchObject({
      codigo: 'caja_anterior_abierta',
      detalle: { fecha: ayer },
    });
    const efectivo = {
      tipo: 'ingreso',
      medio: 'efectivo',
      monto: 100,
      concepto: 'venta',
    };
    expect(
      (await p.post('/panel/caja/movimientos', efectivo).expect(409)).body.error.codigo,
    ).toBe('caja_cerrada');
    expect((await p.get('/panel/caja')).body.fecha).toBe(ayer);

    await p.post('/panel/caja/cerrar', { montoContado: 0 }).expect(200);
    await p.post('/panel/caja/abrir', { montoApertura: 0 }).expect(201);
    expect(
      (await p.get('/panel/caja/historial')).body.map((c: { fecha: string }) => c.fecha),
    ).toHaveLength(2);
  });
});
