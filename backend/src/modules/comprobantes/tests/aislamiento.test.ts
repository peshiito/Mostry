import { beforeEach, describe, expect, it } from 'vitest';
import {
  datosAprobacion,
  idPedido,
  pdfMinimo,
  subirComprobante,
} from '../../../test/comprobantes.js';
import { crearCuentaCompleta } from '../../../test/flujoAuth.js';
import { panel } from '../../../test/panel.js';
import { publico } from '../../../test/publico.js';
import { pedido, tiendaLista } from '../../../test/tiendaLista.js';

describe('comprobantes: aislamiento', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;
  let token: string;
  let id: number;
  let cid: number;

  beforeEach(async () => {
    t = await tiendaLista();
    token = (
      await t.comprador
        .post('/publico/pedidos', pedido(t.productos, { medialuna: 1 }))
        .expect(201)
    ).body.token;
    await subirComprobante(t.app, 'dona-rosa', token, pdfMinimo(), 'pago.pdf').expect(
      201,
    );
    id = await idPedido();
    cid = (await t.panel.get(`/panel/pedidos/${id}/comprobantes`)).body[0].id;
  });

  it('otra tienda no ve, no descarga ni aprueba los comprobantes', async () => {
    const martin = await crearCuentaCompleta(t.app, t.correo, 'heladeria');
    const ajeno = panel(t.app, 'heladeria', martin.cookie);
    await ajeno.get(`/panel/pedidos/${id}/comprobantes`).expect(404);
    await ajeno.get(`/panel/pedidos/${id}/comprobantes/${cid}/archivo`).expect(404);
    await ajeno
      .post(`/panel/pedidos/${id}/comprobantes/${cid}/aprobar`, datosAprobacion(1))
      .expect(404);
  });

  it('el comprador (sin sesión) no accede al panel; con el token de una tienda no se sube en otra', async () => {
    await publico(t.app, 'dona-rosa')
      .get(`/panel/pedidos/${id}/comprobantes/${cid}/archivo`)
      .expect(401);
    const martin = await crearCuentaCompleta(t.app, t.correo, 'heladeria');
    await panel(t.app, 'heladeria', martin.cookie).put('/panel/horarios', { tramos: [] });
    expect(
      (await subirComprobante(t.app, 'heladeria', token, pdfMinimo())).status,
    ).toBeGreaterThanOrEqual(400);
  });
});
