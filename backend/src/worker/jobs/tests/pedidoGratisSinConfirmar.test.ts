import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import {
  atrasarPedidos as atrasar,
  pedidoGratisDeAna,
} from '../../../test/pedidoGratis.js';
import { cancelarVencidos } from '../cancelarVencidos.js';

// S1: un pedido que un premio del Club deja en $ 0 espera que lo confirmen.
// Si nadie lo confirma en el plazo del comprobante, se cancela solo.
describe('cancelarVencidos: pedidos gratis del Club sin confirmar', () => {
  let t: Awaited<ReturnType<typeof pedidoGratisDeAna>>;
  // Solo las medialunas del pedido gratis reservan stock.
  const reservado = async () =>
    (await db.selectFrom('productos').select('stockReservado').execute()).reduce(
      (suma, x) => suma + x.stockReservado,
      0,
    );
  const saldo = async () =>
    (await t.panel.post('/panel/club/identificar', { codigo: await t.qr() })).body.sellos;
  const estado = async () =>
    db
      .selectFrom('pedidos')
      .select(['id', 'estado', 'motivoCancelacion'])
      .executeTakeFirstOrThrow();

  beforeEach(async () => {
    t = await pedidoGratisDeAna();
  });

  it('antes del plazo no se toca', async () => {
    await atrasar(1);
    expect((await cancelarVencidos()).cancelados).toBe(0);
    expect((await estado()).estado).toBe('pendiente_confirmacion');
  });

  it('pasado el plazo se cancela, libera el stock y devuelve los sellos', async () => {
    expect(await reservado()).toBe(2);
    expect(await saldo()).toBe(0);
    await atrasar(3);
    expect(await cancelarVencidos()).toEqual({
      revisados: 1,
      cancelados: 1,
      fallidos: 0,
    });
    expect(await estado()).toMatchObject({
      estado: 'cancelado',
      motivoCancelacion: 'Nadie confirmó el pedido a tiempo',
    });
    expect(await reservado()).toBe(0);
    expect(await saldo()).toBe(1);
  });

  it('uno que el comercio confirmó a tiempo no se toca', async () => {
    const { id } = await estado();
    await t.panel
      .post(`/panel/pedidos/${id}/estado`, { estado: 'confirmado' })
      .expect(200);
    await atrasar(3);
    expect((await cancelarVencidos()).cancelados).toBe(0);
    expect((await estado()).estado).toBe('confirmado');
  });
});
