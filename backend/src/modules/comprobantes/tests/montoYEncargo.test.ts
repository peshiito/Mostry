import { beforeEach, describe, expect, it } from 'vitest';
import { datosAprobacion } from '../../../test/comprobantes.js';
import { pedidoHasta, stockDe } from '../../../test/flujoPedido.js';
import { tiendaLista } from '../../../test/tiendaLista.js';

describe('comprobantes: monto exacto y seña de encargo', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;

  beforeEach(async () => {
    t = await tiendaLista();
  });

  it('un monto distinto al del pedido no se aprueba (409 con el esperado)', async () => {
    const { id, comprobanteId } = await pedidoHasta(t, 'comprobante_enviado');
    const res = await t.panel
      .post(
        `/panel/pedidos/${id}/comprobantes/${comprobanteId}/aprobar`,
        datosAprobacion(1),
      )
      .expect(409);
    expect(res.body.error).toMatchObject({
      codigo: 'monto_no_coincide',
      detalle: { esperado: 70000 },
    });
    expect(await stockDe(t.productos.medialuna)).toEqual({ stock: 5, stockReservado: 2 });
  });

  it('una fecha de operación futura se rechaza', async () => {
    const { id, comprobanteId } = await pedidoHasta(t, 'comprobante_enviado');
    const futura = {
      ...datosAprobacion(70000),
      fechaOperacion: new Date(Date.now() + 3 * 86_400_000).toISOString(),
    };
    await t.panel
      .post(`/panel/pedidos/${id}/comprobantes/${comprobanteId}/aprobar`, futura)
      .expect(400);
  });

  it('el ingreso entra con la fecha de la operación, no la de aprobación (6.4)', async () => {
    const { id, comprobanteId } = await pedidoHasta(t, 'comprobante_enviado');
    const ayer = new Date(Date.now() - 86_400_000);
    await t.panel
      .post(`/panel/pedidos/${id}/comprobantes/${comprobanteId}/aprobar`, {
        ...datosAprobacion(70000),
        fechaOperacion: ayer.toISOString(),
      })
      .expect(200);
    const resumenHoy = (await t.panel.get('/panel/caja/resumen')).body;
    expect(resumenHoy.ingresos).toBe(0);
  });

  it('rechazar la seña de un encargo reinicia el plazo de 24 h', async () => {
    const { id, comprobanteId } = await pedidoHasta(t, 'comprobante_enviado', 'encargo');
    const res = await t.panel
      .post(`/panel/pedidos/${id}/comprobantes/${comprobanteId}/rechazar`, {
        motivo: 'Ilegible',
      })
      .expect(200);
    expect(
      (new Date(res.body.venceComprobanteEn).getTime() - Date.now()) / 3_600_000,
    ).toBeCloseTo(24, 1);
    expect(await stockDe(t.productos.rogel)).toEqual({ stock: 0, stockReservado: 0 });
  });
});
