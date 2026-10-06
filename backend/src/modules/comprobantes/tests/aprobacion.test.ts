import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import {
  datosAprobacion,
  idPedido,
  subirComprobante,
} from '../../../test/comprobantes.js';
import { png } from '../../../test/imagenes.js';
import { pedido, tiendaLista } from '../../../test/tiendaLista.js';

describe('comprobantes: subir y aprobar (sección 6.1)', () => {
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

  it('aprobar: guarda los datos, descuenta stock, libera la reserva, entra a caja y programa el borrado', async () => {
    await subirComprobante(t.app, 'dona-rosa', token, await png()).expect(201);
    const [c] = (await t.panel.get(`/panel/pedidos/${id}/comprobantes`).expect(200)).body;
    expect(c).toMatchObject({
      estado: 'pendiente',
      tipo: 'pago',
      archivoDisponible: true,
    });
    expect(c).not.toHaveProperty('archivoClave');

    const res = await t.panel
      .post(`/panel/pedidos/${id}/comprobantes/${c.id}/aprobar`, datosAprobacion(70000))
      .expect(200);
    expect(res.body.estado).toBe('pago_aprobado');
    expect(await medialuna()).toEqual({ stock: 3, stockReservado: 0 });
    const caja = (await t.panel.get('/panel/caja/resumen')).body;
    expect(caja.movimientos).toEqual([
      expect.objectContaining({
        tipo: 'ingreso',
        medio: 'transferencia',
        monto: 70000,
        origen: 'pedido',
      }),
    ]);
    const fila = await db
      .selectFrom('comprobantes')
      .selectAll()
      .executeTakeFirstOrThrow();
    expect(fila).toMatchObject({
      estado: 'aprobado',
      titular: 'Ana Pérez',
      numeroOperacion: '000123456',
    });
    expect((fila.archivoBorrarEn!.getTime() - Date.now()) / 3_600_000).toBeCloseTo(2, 1);
  });
});
