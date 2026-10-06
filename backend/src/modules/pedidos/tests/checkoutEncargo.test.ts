import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { pedido, tiendaLista } from '../../../test/tiendaLista.js';

const enDias = (d: number) => new Date(Date.now() + d * 86_400_000).toISOString();

describe('checkout: encargos', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;
  const encargo = (lineas: Record<string, number>, extra = {}) =>
    pedido(t.productos, lineas, { tipo: 'encargo', fechaEncargo: enDias(3), ...extra });

  beforeEach(async () => {
    t = await tiendaLista();
  });

  it('con seña (30%): pendiente de pago por la seña, plazo de 24 h y SIN tocar stock', async () => {
    const res = await t.comprador
      .post('/publico/pedidos', encargo({ rogel: 1 }))
      .expect(201);
    expect(res.body).toMatchObject({
      estado: 'pendiente_pago',
      total: 2800000,
      sena: 840000,
    });
    expect(res.body.pago.monto).toBe(840000);
    expect(
      (new Date(res.body.venceComprobanteEn).getTime() - Date.now()) / 3_600_000,
    ).toBeCloseTo(24, 1);
    const rogel = await db
      .selectFrom('productos')
      .select(['stock', 'stockReservado'])
      .where('id', '=', t.productos.rogel)
      .executeTakeFirstOrThrow();
    expect(rogel).toEqual({ stock: 0, stockReservado: 0 });
  });

  it('sin seña: queda pendiente de confirmación, sin pago ni plazo', async () => {
    await db.updateTable('tiendas').set({ senaPorcentaje: 0 }).execute();
    const res = await t.comprador
      .post('/publico/pedidos', encargo({ rogel: 1 }))
      .expect(201);
    expect(res.body).toMatchObject({
      estado: 'pendiente_confirmacion',
      sena: 0,
      pago: null,
      venceComprobanteEn: null,
    });
  });

  it('rechaza productos que no se encargan y fechas fuera de regla', async () => {
    expect(
      (await t.comprador.post('/publico/pedidos', encargo({ medialuna: 1 }))).body.error
        .codigo,
    ).toBe('producto_sin_encargo');
    const res = await t.comprador
      .post('/publico/pedidos', encargo({ rogel: 1 }, { fechaEncargo: enDias(0.5) }))
      .expect(400);
    expect(res.body.error).toMatchObject({
      codigo: 'fecha_encargo_invalida',
      detalle: { problema: 'anticipacion' },
    });
    await t.comprador
      .post('/publico/pedidos', pedido(t.productos, { rogel: 1 }, { tipo: 'encargo' }))
      .expect(400);
  });
});
