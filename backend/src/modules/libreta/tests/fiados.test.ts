import { beforeEach, describe, expect, it } from 'vitest';
import { appConCuenta } from '../../../test/appConCuenta.js';

describe('libreta: fiados', () => {
  let p: Awaited<ReturnType<typeof appConCuenta>>['panel'];
  let id: number;
  const mover = (body: object) =>
    p.post(`/panel/libreta/clientes/${id}/movimientos`, body);

  beforeEach(async () => {
    ({ panel: p } = await appConCuenta());
    id = (
      await p
        .post('/panel/libreta/clientes', {
          nombre: 'Doña Marta',
          telefono: '11 2345-6789',
        })
        .expect(201)
    ).body.id;
  });

  it('el saldo se calcula: deudas − pagos; la deuda no mueve caja, el pago sí', async () => {
    await mover({ tipo: 'deuda', monto: 500_000, detalle: 'Docena y media' }).expect(201);
    const res = await mover({
      tipo: 'pago',
      monto: 200_000,
      medio: 'transferencia',
    }).expect(201);
    expect(res.body).toMatchObject({ saldo: 300_000, telefono: '5491123456789' });
    expect(res.body.movimientos).toHaveLength(2);
    const caja = (await p.get('/panel/caja/resumen')).body;
    expect(caja.movimientos).toEqual([
      expect.objectContaining({
        tipo: 'ingreso',
        origen: 'fiado',
        monto: 200_000,
      }),
    ]);
    expect((await p.get('/panel/libreta/clientes')).body[0].saldo).toBe(300_000);
  });

  it('no se cobra más de lo que debe; un pago en efectivo exige caja abierta', async () => {
    await mover({ tipo: 'deuda', monto: 100 }).expect(201);
    expect(
      (await mover({ tipo: 'pago', monto: 101, medio: 'transferencia' }).expect(409)).body
        .error.detalle,
    ).toEqual({ saldo: 100 });
    expect(
      (await mover({ tipo: 'pago', monto: 100, medio: 'efectivo' }).expect(409)).body
        .error.codigo,
    ).toBe('caja_cerrada');
    expect((await p.get(`/panel/libreta/clientes/${id}`)).body.saldo).toBe(100);
  });

  it('valida: pago sin medio, deuda con medio, monto 0', async () => {
    await mover({ tipo: 'pago', monto: 1 }).expect(400);
    await mover({ tipo: 'deuda', monto: 1, medio: 'efectivo' }).expect(400);
    await mover({ tipo: 'deuda', monto: 0 }).expect(400);
  });

  it('dos pagos simultáneos por el total: entra uno solo', async () => {
    await mover({ tipo: 'deuda', monto: 1000 }).expect(201);
    const r = await Promise.all(
      [1, 2].map(() => mover({ tipo: 'pago', monto: 1000, medio: 'transferencia' })),
    );
    expect(r.map((x) => x.status).sort()).toEqual([201, 409]);
    expect((await p.get('/panel/caja/resumen')).body.ingresos).toBe(1000);
  });
});
