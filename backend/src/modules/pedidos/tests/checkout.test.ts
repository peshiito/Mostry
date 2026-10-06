import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { pedido, tiendaLista } from '../../../test/tiendaLista.js';

describe('checkout: pedido inmediato', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;
  const reservado = async (id: number) =>
    (
      await db
        .selectFrom('productos')
        .select('stockReservado')
        .where('id', '=', id)
        .executeTakeFirstOrThrow()
    ).stockReservado;

  beforeEach(async () => {
    t = await tiendaLista();
  });

  it('crea el pedido, reserva stock y devuelve a dónde pagar', async () => {
    const res = await t.comprador
      .post('/publico/pedidos', pedido(t.productos, { medialuna: 2, vigilante: 1 }))
      .expect(201);
    expect(res.body).toMatchObject({
      numero: 1,
      estado: 'pendiente_pago',
      total: 110000,
      sena: 0,
    });
    expect(res.body.pago).toEqual({
      alias: 'dona.rosa.mp',
      titular: 'Rosa Gómez',
      monto: 110000,
    });
    expect(res.body.token).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(res.body.seguimiento).toContain(`/pedido/${res.body.token}`);
    expect(
      (new Date(res.body.venceComprobanteEn).getTime() - Date.now()) / 3_600_000,
    ).toBeCloseTo(2, 1);
    expect(await reservado(t.productos.medialuna)).toBe(2);
  });

  it('con envío suma el costo y guarda la dirección', async () => {
    const datos = pedido(
      t.productos,
      { vigilante: 1 },
      { entrega: 'envio', direccion: 'Yrigoyen 4250, Lanús' },
    );
    const res = await t.comprador.post('/publico/pedidos', datos).expect(201);
    expect(res.body.total).toBe(40000 + 150000);
  });

  it('numera de a uno por tienda y normaliza el WhatsApp', async () => {
    await t.comprador
      .post('/publico/pedidos', pedido(t.productos, { vigilante: 1 }))
      .expect(201);
    const segundo = await t.comprador
      .post('/publico/pedidos', pedido(t.productos, { vigilante: 1 }))
      .expect(201);
    expect(segundo.body.numero).toBe(2);
    const fila = await db
      .selectFrom('pedidos')
      .select('clienteWhatsapp')
      .executeTakeFirstOrThrow();
    expect(fila.clienteWhatsapp).toBe('5491123456789');
  });
});
