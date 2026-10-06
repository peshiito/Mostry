import { beforeEach, describe, expect, it } from 'vitest';
import { pedidoHasta } from '../../../test/flujoPedido.js';
import { tiendaLista } from '../../../test/tiendaLista.js';

describe('caja: los cobros automáticos en efectivo entran en el cierre', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;

  beforeEach(async () => {
    t = await tiendaLista();
  });

  it('el resto cobrado y la devolución en efectivo cuentan en la diferencia', async () => {
    await t.panel.post('/panel/caja/abrir', { montoApertura: 100_000 }).expect(201);
    const encargo = await pedidoHasta(t, 'pago_aprobado', 'encargo');
    for (const estado of ['en_preparacion', 'listo_retirar'])
      await t.panel.post(`/panel/pedidos/${encargo.id}/estado`, { estado });
    await t.panel
      .post(`/panel/pedidos/${encargo.id}/estado`, {
        estado: 'entregado',
        medioCobro: 'efectivo',
      })
      .expect(200);
    const inmediato = await pedidoHasta(t, 'pago_aprobado');
    await t.panel
      .post(`/panel/pedidos/${inmediato.id}/cancelar`, {
        motivo: 'Sin stock',
        devolucion: { medio: 'efectivo' },
      })
      .expect(200);

    const esperado = 100_000 + (2_800_000 - 840_000) - 70_000;
    expect((await t.panel.get('/panel/caja')).body.esperado).toBe(esperado);
    const cerrada = (
      await t.panel.post('/panel/caja/cerrar', { montoContado: esperado }).expect(200)
    ).body;
    expect(cerrada.diferencia).toBe(0);
  });
});
