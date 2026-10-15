import { beforeEach, describe, expect, it } from 'vitest';
import { clubTienda, darSellos } from '../../../test/clubTienda.js';
import { pedido } from '../../../test/tiendaLista.js';

// Lealtad L4: usar un premio en el checkout. El descuento lo calcula el servidor.
describe('club: premios en compras online', () => {
  let t: Awaited<ReturnType<typeof clubTienda>>;
  const saldo = async () =>
    (await t.panel.post('/panel/club/identificar', { codigo: await t.qr() })).body.sellos;
  // 2 medialunas = $ 700; el premio de 2 sellos es 50 % con tope de $ 300.
  const conPremio = (totalEsperado: number) =>
    pedido(t.productos, { medialuna: 2 }, { premio: 2, totalEsperado });

  beforeEach(async () => {
    t = await clubTienda();
  });

  it('descuenta con tope, gasta los sellos y al cancelar vuelven', async () => {
    await darSellos(2);
    const { body } = await t.comoAna('/publico/pedidos', conPremio(40_000)).expect(201);
    expect(body.total).toBe(40_000);
    expect(await saldo()).toBe(0);
    const seg = await t.comprador.get(`/publico/pedidos/${body.token}`).expect(200);
    expect(seg.body).toMatchObject({ descuento: 30_000, premio: { compras: 2 } });
    const { idPedido } = await import('../../../test/comprobantes.js');
    const id = await idPedido(body.numero);
    await t.panel.post(`/panel/pedidos/${id}/cancelar`, { motivo: 'Se arrepintió' });
    expect(await saldo()).toBe(2);
  });

  it('un total manipulado no pasa: el servidor recalcula', async () => {
    await darSellos(2);
    const r = await t.comoAna('/publico/pedidos', conPremio(0)).expect(409);
    expect(r.body.error).toMatchObject({
      codigo: 'precio_cambio',
      detalle: { total: 40_000 },
    });
    expect(await saldo()).toBe(2);
  });

  it('sin sellos suficientes, o sin entrar al Club, no hay premio', async () => {
    await darSellos(1);
    const r = await t.comoAna('/publico/pedidos', conPremio(40_000)).expect(409);
    expect(r.body.error.codigo).toBe('sellos_insuficientes');
    await t.comprador.post('/publico/pedidos', conPremio(40_000)).expect(401);
  });

  it('un premio del 100 % deja el pedido gratis y sin pago', async () => {
    await t.panel.put('/panel/club', {
      ...(await import('../../../test/clubTienda.js')).programaTest,
      premios: [
        { compras: 1, tipo: 'porcentaje', valor: 100, tope: null, descripcion: null },
      ],
    });
    await darSellos(1);
    const datos = pedido(t.productos, { medialuna: 2 }, { premio: 1, totalEsperado: 0 });
    const { body } = await t.comoAna('/publico/pedidos', datos).expect(201);
    expect(body).toMatchObject({
      total: 0,
      estado: 'pendiente_confirmacion',
      pago: null,
    });
  });
});
