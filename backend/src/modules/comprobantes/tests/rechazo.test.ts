import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { idPedido, subirComprobante } from '../../../test/comprobantes.js';
import { png } from '../../../test/imagenes.js';
import { pedido, tiendaLista } from '../../../test/tiendaLista.js';

describe('comprobantes: rechazo (una sola segunda oportunidad)', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;
  let token: string;
  let id: number;
  const rechazarUltimo = async (motivo?: string) => {
    const [c] = (await t.panel.get(`/panel/pedidos/${id}/comprobantes`)).body;
    return t.panel.post(
      `/panel/pedidos/${id}/comprobantes/${c.id}/rechazar`,
      motivo ? { motivo } : {},
    );
  };

  beforeEach(async () => {
    t = await tiendaLista();
    token = (
      await t.comprador
        .post('/publico/pedidos', pedido(t.productos, { medialuna: 2 }))
        .expect(201)
    ).body.token;
    id = await idPedido();
    await subirComprobante(t.app, 'dona-rosa', token, await png()).expect(201);
  });

  it('el primero vuelve a "pendiente de pago" con el plazo reiniciado; el motivo es obligatorio', async () => {
    expect((await rechazarUltimo()).status).toBe(400);
    const res = await rechazarUltimo('El monto no coincide');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      estado: 'pendiente_pago',
      rechazos: 1,
      cancelado: false,
    });
    expect(
      (new Date(res.body.venceComprobanteEn).getTime() - Date.now()) / 3_600_000,
    ).toBeCloseTo(2, 1);
    const fila = await db
      .selectFrom('comprobantes')
      .select(['estado', 'motivoRechazo', 'archivoBorrarEn'])
      .executeTakeFirstOrThrow();
    expect(fila).toMatchObject({
      estado: 'rechazado',
      motivoRechazo: 'El monto no coincide',
    });
    expect((fila.archivoBorrarEn!.getTime() - Date.now()) / 3_600_000).toBeCloseTo(48, 1);
  });

  it('el segundo rechazo cancela el pedido y libera la reserva', async () => {
    expect((await rechazarUltimo('Ilegible')).status).toBe(200);
    await subirComprobante(t.app, 'dona-rosa', token, await png()).expect(201);
    const res = await rechazarUltimo('Otra vez ilegible');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ estado: 'cancelado', cancelado: true });
    const p = await db
      .selectFrom('productos')
      .select('stockReservado')
      .where('id', '=', t.productos.medialuna)
      .executeTakeFirstOrThrow();
    expect(p.stockReservado).toBe(0);
  });
});
