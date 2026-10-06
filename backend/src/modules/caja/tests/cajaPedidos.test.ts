import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { pedido, tiendaLista } from '../../../test/tiendaLista.js';

const enDias = (d: number) => new Date(Date.now() + d * 86_400_000).toISOString();

describe('caja: cobros y devoluciones de pedidos', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;
  let id: number;
  const avanzar = (estado: string, extra = {}) =>
    t.panel.post(`/panel/pedidos/${id}/estado`, { estado, ...extra });

  beforeEach(async () => {
    t = await tiendaLista();
    await t.comprador
      .post(
        '/publico/pedidos',
        pedido(t.productos, { rogel: 1 }, { tipo: 'encargo', fechaEncargo: enDias(3) }),
      )
      .expect(201);
    id = (await db.selectFrom('pedidos').select('id').executeTakeFirstOrThrow()).id;
  });

  it('entregar un encargo cobra el resto y lo registra en la caja de hoy', async () => {
    await db.updateTable('pedidos').set({ estado: 'listo_retirar' }).execute(); // seña ya aprobada
    expect(
      (await avanzar('entregado', { medioCobro: 'efectivo' }).expect(409)).body.error
        .codigo,
    ).toBe('caja_cerrada');
    await t.panel.post('/panel/caja/abrir', { montoApertura: 0 }).expect(201);
    await avanzar('entregado').expect(409);
    await avanzar('entregado', { medioCobro: 'efectivo' }).expect(200);
    const caja = (await t.panel.get('/panel/caja')).body;
    expect(caja.movimientos).toEqual([
      expect.objectContaining({
        tipo: 'ingreso',
        monto: 2800000 - 840000,
        origen: 'pedido',
        origenId: id,
      }),
    ]);
  });

  it('cancelar un encargo con seña pagada puede registrar la devolución', async () => {
    await db.updateTable('pedidos').set({ estado: 'en_preparacion' }).execute();
    const res = await t.panel
      .post(`/panel/pedidos/${id}/cancelar`, {
        motivo: 'Sin insumos',
        devolucion: { medio: 'transferencia' },
      })
      .expect(200);
    expect(res.body).toMatchObject({
      estado: 'cancelado',
      habiaPago: true,
      devuelto: 840000,
    });
    const r = (await t.panel.get('/panel/caja/resumen')).body;
    expect(r.egresos).toBe(840000);
  });
});
