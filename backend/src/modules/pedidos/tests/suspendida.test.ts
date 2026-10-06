import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { pdfMinimo, subirComprobante } from '../../../test/comprobantes.js';
import { pedidoHasta } from '../../../test/flujoPedido.js';
import { pedido, tiendaLista } from '../../../test/tiendaLista.js';

describe('tienda suspendida (sección 6.5 y decisión 19)', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;
  const suspender = () =>
    db
      .updateTable('tiendas')
      .set({ suspendidaManual: true, motivoSuspension: 'x' })
      .execute();

  beforeEach(async () => {
    t = await tiendaLista();
  });

  it('el público no compra ni sube comprobantes, pero el seguimiento sigue andando', async () => {
    const { token } = (
      await t.comprador
        .post('/publico/pedidos', pedido(t.productos, { medialuna: 1 }))
        .expect(201)
    ).body;
    await suspender();
    expect(
      (
        await t.comprador
          .post('/publico/pedidos', pedido(t.productos, { medialuna: 1 }))
          .expect(403)
      ).body.error.codigo,
    ).toBe('tienda_cerrada');
    expect((await subirComprobante(t.app, 'dona-rosa', token, pdfMinimo())).status).toBe(
      403,
    );
    expect(
      (await t.comprador.get(`/publico/pedidos/${token}`).expect(200)).body.numero,
    ).toBe(1);
  });

  it('el panel lee pero no aprueba, no cancela, no avanza ni mueve la caja', async () => {
    const { id, comprobanteId, monto } = await pedidoHasta(t, 'comprobante_enviado');
    await suspender();
    const base = `/panel/pedidos/${id}`;
    const escrituras = [
      t.panel.post(`${base}/comprobantes/${comprobanteId}/aprobar`, {
        monto,
        fechaOperacion: new Date().toISOString(),
        titular: 'Ana',
        numeroOperacion: '1',
      }),
      t.panel.post(`${base}/comprobantes/${comprobanteId}/rechazar`, {
        motivo: 'Ilegible',
      }),
      t.panel.post(`${base}/cancelar`, { motivo: 'Prueba' }),
      t.panel.post('/panel/caja/abrir', { montoApertura: 0 }),
      t.panel.post('/panel/gastos', { tipo: 'gasto', monto: 1, medio: 'transferencia' }),
    ];
    for (const r of await Promise.all(escrituras))
      expect(r.body.error?.codigo).toBe('tienda_suspendida');
    await t.panel.get(base).expect(200);
    await t.panel.get(`${base}/comprobantes/${comprobanteId}/archivo`).expect(200);
  });
});
