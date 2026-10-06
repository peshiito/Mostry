import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { datosAprobacion } from '../../../test/comprobantes.js';
import { pedidoHasta, stockDe } from '../../../test/flujoPedido.js';
import { tiendaLista } from '../../../test/tiendaLista.js';

describe('cancelar en cada estado', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;
  const cancelar = (id: number, extra = {}) =>
    t.panel.post(`/panel/pedidos/${id}/cancelar`, { motivo: 'Prueba', ...extra });

  beforeEach(async () => {
    t = await tiendaLista();
  });

  it('ya pagado: devuelve el stock y registra la devolución (la ganancia la descuenta)', async () => {
    const { id } = await pedidoHasta(t, 'pago_aprobado');
    const res = await cancelar(id, { devolucion: { medio: 'transferencia' } }).expect(
      200,
    );
    expect(res.body).toMatchObject({ habiaPago: true, devuelto: 70000 });
    expect(await stockDe(t.productos.medialuna)).toEqual({ stock: 5, stockReservado: 0 });
    expect((await t.panel.get('/panel/caja/resumen')).body).toMatchObject({
      ingresos: 70000,
      devoluciones: 70000,
      gananciaReal: 0,
    });
  });

  it('con comprobante enviado: libera la reserva, programa el borrado y ya no se puede aprobar', async () => {
    const { id, comprobanteId } = await pedidoHasta(t, 'comprobante_enviado');
    await cancelar(id).expect(200);
    expect(await stockDe(t.productos.medialuna)).toEqual({ stock: 5, stockReservado: 0 });
    const c = await db
      .selectFrom('comprobantes')
      .select('archivoBorrarEn')
      .executeTakeFirstOrThrow();
    expect((c.archivoBorrarEn!.getTime() - Date.now()) / 3_600_000).toBeLessThanOrEqual(
      48.01,
    );
    await t.panel
      .post(
        `/panel/pedidos/${id}/comprobantes/${comprobanteId}/aprobar`,
        datosAprobacion(70000),
      )
      .expect(409);
    expect(await stockDe(t.productos.medialuna)).toEqual({ stock: 5, stockReservado: 0 });
  });

  it('devolución en efectivo con la caja cerrada: 409 y NO se cancela nada', async () => {
    const { id } = await pedidoHasta(t, 'pago_aprobado');
    const res = await cancelar(id, { devolucion: { medio: 'efectivo' } }).expect(409);
    expect(res.body.error.mensaje).toContain('NO se canceló');
    expect((await t.panel.get(`/panel/pedidos/${id}`)).body.estado).toBe('pago_aprobado');
    expect(await stockDe(t.productos.medialuna)).toEqual({ stock: 3, stockReservado: 0 });
  });

  it('sin pago aprobado no hay devolución posible', async () => {
    const { id } = await pedidoHasta(t, 'comprobante_enviado', 'encargo');
    expect(
      (await cancelar(id, { devolucion: { medio: 'transferencia' } }).expect(409)).body
        .error.codigo,
    ).toBe('sin_pago_para_devolver');
    expect((await t.panel.get(`/panel/pedidos/${id}`)).body.estado).toBe(
      'comprobante_enviado',
    );
  });
});
