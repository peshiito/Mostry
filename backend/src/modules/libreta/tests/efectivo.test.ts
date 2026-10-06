import { beforeEach, describe, expect, it } from 'vitest';
import { appConCuenta } from '../../../test/appConCuenta.js';

describe('libreta y gastos en efectivo con la caja abierta', () => {
  let p: Awaited<ReturnType<typeof appConCuenta>>['panel'];

  beforeEach(async () => {
    ({ panel: p } = await appConCuenta());
    await p.post('/panel/caja/abrir', { montoApertura: 100_000 }).expect(201);
  });

  it('el pago de fiado y el gasto en efectivo entran en la caja de hoy y en el cierre', async () => {
    const { id } = (await p.post('/panel/libreta/clientes', { nombre: 'Marta' })).body;
    await p
      .post(`/panel/libreta/clientes/${id}/movimientos`, { tipo: 'deuda', monto: 50_000 })
      .expect(201);
    await p
      .post(`/panel/libreta/clientes/${id}/movimientos`, {
        tipo: 'pago',
        monto: 30_000,
        medio: 'efectivo',
      })
      .expect(201);
    await p
      .post('/panel/gastos', {
        tipo: 'gasto',
        monto: 20_000,
        medio: 'efectivo',
        detalle: 'Bolsas',
      })
      .expect(201);

    const caja = (await p.get('/panel/caja').expect(200)).body;
    expect(caja.movimientos.every((m: { cajaId: number }) => m.cajaId === caja.id)).toBe(
      true,
    );
    expect(caja.esperado).toBe(100_000 + 30_000 - 20_000);
    const cerrada = (await p.post('/panel/caja/cerrar', { montoContado: 105_000 })).body;
    expect(cerrada.diferencia).toBe(-5_000);
  });
});
