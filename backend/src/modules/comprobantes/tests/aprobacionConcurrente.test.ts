import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import {
  datosAprobacion,
  idPedido,
  subirComprobante,
} from '../../../test/comprobantes.js';
import { png } from '../../../test/imagenes.js';
import { pedido, tiendaLista } from '../../../test/tiendaLista.js';

describe('comprobantes: aprobaciones simultáneas', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;
  let token: string;
  let id: number;
  const medialuna = () =>
    db
      .selectFrom('productos')
      .select(['stock', 'stockReservado'])
      .where('id', '=', t.productos.medialuna)
      .executeTakeFirstOrThrow();

  beforeEach(async () => {
    t = await tiendaLista();
    token = (
      await t.comprador
        .post('/publico/pedidos', pedido(t.productos, { medialuna: 2 }))
        .expect(201)
    ).body.token;
    id = await idPedido();
  });

  it('dos aprobaciones a la vez: una sola pasa (sin doble ingreso ni doble descuento)', async () => {
    await subirComprobante(t.app, 'dona-rosa', token, await png()).expect(201);
    const [c] = (await t.panel.get(`/panel/pedidos/${id}/comprobantes`)).body;
    const ruta = `/panel/pedidos/${id}/comprobantes/${c.id}/aprobar`;
    const r = await Promise.all([
      t.panel.post(ruta, datosAprobacion(70000)),
      t.panel.post(ruta, datosAprobacion(70000)),
    ]);
    expect(r.map((x) => x.status).sort()).toEqual([200, 409]);
    expect(await medialuna()).toEqual({ stock: 3, stockReservado: 0 });
    expect((await t.panel.get('/panel/caja/resumen')).body.ingresos).toBe(70000);
  });
});
