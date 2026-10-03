import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../shared/db/db.js';
import { crearPedido, crearProducto, crearTienda } from '../../test/fabricas.js';
import { limpiarBase } from '../../test/limpiarBase.js';

const CHECK = /check constraint/i;

describe('restricciones CHECK y tipos', () => {
  let tiendaId: number;

  beforeEach(async () => {
    await limpiarBase();
    tiendaId = await crearTienda('dona-rosa');
  });

  it('nunca se reserva más stock del que hay', async () => {
    const id = await crearProducto(tiendaId, 5);
    const reservar = (n: number) =>
      db
        .updateTable('productos')
        .set({ stockReservado: n })
        .where('id', '=', id)
        .execute();
    await expect(reservar(5)).resolves.toBeDefined();
    await expect(reservar(6)).rejects.toThrow(CHECK);
  });

  it('el total del pedido tiene que ser subtotal + envío', async () => {
    const id = await crearPedido(tiendaId);
    const romper = db
      .updateTable('pedidos')
      .set({ total: 1 })
      .where('id', '=', id)
      .execute();
    await expect(romper).rejects.toThrow(CHECK);
  });

  it('rechaza slugs inválidos aunque el código no los valide', async () => {
    for (const slug of ['Mayus', '-guion', 'ab', 'con espacio']) {
      await expect(crearTienda(slug)).rejects.toThrow(CHECK);
    }
  });

  it('un movimiento en efectivo exige caja', async () => {
    const mov = {
      tiendaId,
      tipo: 'ingreso' as const,
      monto: 100,
      concepto: 'x',
      fecha: new Date(),
    };
    const insertar = (medio: 'efectivo' | 'transferencia') =>
      db
        .insertInto('movimientosCaja')
        .values({ ...mov, medio, origen: 'manual' })
        .execute();
    await expect(insertar('efectivo')).rejects.toThrow(CHECK);
    await expect(insertar('transferencia')).resolves.toBeDefined();
  });

  it('devuelve BOOLEAN como boolean, DATE como texto y camelCase', async () => {
    await db.insertInto('feriados').values({ tiendaId, fecha: '2026-12-25' }).execute();
    const tienda = await db.selectFrom('tiendas').selectAll().executeTakeFirstOrThrow();
    const feriado = await db.selectFrom('feriados').selectAll().executeTakeFirstOrThrow();
    expect(tienda.pausada).toBe(false);
    expect(tienda.creadoEn).toBeInstanceOf(Date);
    expect(feriado.fecha).toBe('2026-12-25');
  });
});
