import { beforeEach, describe, expect, it } from 'vitest';
import { datosAprobacion } from '../../../test/comprobantes.js';
import { crearCuentaCompleta } from '../../../test/flujoAuth.js';
import { pedidoHasta, stockDe } from '../../../test/flujoPedido.js';
import { panel } from '../../../test/panel.js';
import { publico } from '../../../test/publico.js';
import { tiendaLista } from '../../../test/tiendaLista.js';

describe('pedidos: IDOR', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;

  beforeEach(async () => {
    t = await tiendaLista();
  });

  it('otra tienda no avanza ni rechaza; su origen no ve el seguimiento ajeno', async () => {
    const { id, token, comprobanteId } = await pedidoHasta(t, 'comprobante_enviado');
    const martin = await crearCuentaCompleta(t.app, t.correo, 'heladeria');
    const ajeno = panel(t.app, 'heladeria', martin.cookie);
    await ajeno.post(`/panel/pedidos/${id}/estado`, { estado: 'confirmado' }).expect(404);
    await ajeno
      .post(`/panel/pedidos/${id}/comprobantes/${comprobanteId}/rechazar`, {
        motivo: 'Sabotaje',
      })
      .expect(404);
    expect(
      (await publico(t.app, 'heladeria').get(`/publico/pedidos/${token}`)).status,
    ).toBe(404);
  });

  it('el comprobante de un pedido no se aprueba por la ruta de otro pedido', async () => {
    const a = await pedidoHasta(t, 'comprobante_enviado');
    const b = await pedidoHasta(t, 'comprobante_enviado');
    await t.panel
      .post(
        `/panel/pedidos/${b.id}/comprobantes/${a.comprobanteId}/aprobar`,
        datosAprobacion(70000),
      )
      .expect(404);
    expect(await stockDe(t.productos.medialuna)).toEqual({ stock: 5, stockReservado: 4 });
  });
});
