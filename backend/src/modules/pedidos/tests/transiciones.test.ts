import { beforeEach, describe, it, expect } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { pedido, tiendaLista } from '../../../test/tiendaLista.js';

describe('panel: transiciones inválidas', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;
  const crear = async (datos: object) =>
    (await t.comprador.post('/publico/pedidos', datos).expect(201)).body;
  const idDe = async (numero: number) =>
    (
      await db
        .selectFrom('pedidos')
        .select('id')
        .where('numero', '=', numero)
        .executeTakeFirstOrThrow()
    ).id;

  beforeEach(async () => {
    t = await tiendaLista();
  });

  it('no deja saltear pasos ni mandar "en camino" un pedido para retirar', async () => {
    await crear(pedido(t.productos, { medialuna: 1 }));
    const id = await idDe(1);
    const res = await t.panel
      .post(`/panel/pedidos/${id}/estado`, { estado: 'en_preparacion' })
      .expect(409);
    expect(res.body.error.detalle).toEqual({
      desde: 'pendiente_pago',
      hacia: 'en_preparacion',
    });
    await t.panel
      .post(`/panel/pedidos/${id}/estado`, { estado: 'pago_aprobado' })
      .expect(400);
  });
});
