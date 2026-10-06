import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { pedidoHasta, stockDe } from '../../../test/flujoPedido.js';
import { pedido, tiendaLista } from '../../../test/tiendaLista.js';
import { borrarComprobantesVencidos } from '../borrarComprobantes.js';
import { cancelarVencidos } from '../cancelarVencidos.js';
import { privadosBajo } from '../../../test/bucket.js';

describe('worker: pedidos vencidos y comprobantes a borrar', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;

  beforeEach(async () => {
    t = await tiendaLista();
  });

  it('cancela solo los vencidos, libera la reserva y es idempotente', async () => {
    await t.comprador
      .post('/publico/pedidos', pedido(t.productos, { medialuna: 2 }))
      .expect(201);
    await t.comprador
      .post('/publico/pedidos', pedido(t.productos, { medialuna: 1 }))
      .expect(201);
    await db
      .updateTable('pedidos')
      .set({ venceComprobanteEn: new Date(Date.now() - 1000) })
      .where('numero', '=', 1)
      .execute();
    expect(await cancelarVencidos()).toEqual({
      revisados: 1,
      cancelados: 1,
      fallidos: 0,
    });
    expect(await cancelarVencidos()).toEqual({
      revisados: 0,
      cancelados: 0,
      fallidos: 0,
    });
    const estados = await db
      .selectFrom('pedidos')
      .select(['numero', 'estado', 'motivoCancelacion'])
      .orderBy('numero')
      .execute();
    expect(estados).toEqual([
      { numero: 1, estado: 'cancelado', motivoCancelacion: 'Venció el plazo para pagar' },
      { numero: 2, estado: 'pendiente_pago', motivoCancelacion: null },
    ]);
    expect(await stockDe(t.productos.medialuna)).toEqual({ stock: 5, stockReservado: 1 });
  });

  it('borra la imagen del comprobante aprobado al vencer el plazo, pero conserva los datos del pago', async () => {
    await pedidoHasta(t, 'pago_aprobado');
    expect(await borrarComprobantesVencidos()).toEqual({ borrados: 0, fallidos: 0 }); // todavía no pasaron 2 h
    await db
      .updateTable('comprobantes')
      .set({ archivoBorrarEn: new Date(Date.now() - 1000) })
      .execute();
    expect(await borrarComprobantesVencidos()).toEqual({ borrados: 1, fallidos: 0 });
    expect(await privadosBajo('tiendas/')).toEqual([]);
    const c = await db.selectFrom('comprobantes').selectAll().executeTakeFirstOrThrow();
    expect(c).toMatchObject({ archivoClave: null, titular: 'Ana Pérez', monto: 70000 });
    expect(c.archivoBorradoEn).not.toBeNull();
  });
});
