import { beforeEach, describe, expect, it } from 'vitest';
import { subirComprobante } from '../../../test/comprobantes.js';
import { png } from '../../../test/imagenes.js';
import { pedido, tiendaLista } from '../../../test/tiendaLista.js';

describe('comprobantes: subida', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;
  let token: string;

  beforeEach(async () => {
    t = await tiendaLista();
    token = (
      await t.comprador
        .post('/publico/pedidos', pedido(t.productos, { medialuna: 2 }))
        .expect(201)
    ).body.token;
  });

  it('al subirlo el pedido pasa a "comprobante enviado" y el plazo se frena', async () => {
    const res = await subirComprobante(t.app, 'dona-rosa', token, await png()).expect(
      201,
    );
    expect(res.body).toMatchObject({
      estado: 'comprobante_enviado',
      venceComprobanteEn: null,
    });
    await subirComprobante(t.app, 'dona-rosa', token, await png()).expect(409);
  });
});
