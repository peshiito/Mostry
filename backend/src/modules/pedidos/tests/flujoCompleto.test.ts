import { beforeEach, describe, expect, it } from 'vitest';
import { pedidoHasta, stockDe } from '../../../test/flujoPedido.js';
import { tiendaLista } from '../../../test/tiendaLista.js';

describe('flujo completo por la API (CLAUDE.md 6.1 y 6.2)', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;
  const avanzar = (id: number, estado: string, extra = {}) =>
    t.panel.post(`/panel/pedidos/${id}/estado`, { estado, ...extra }).expect(200);

  beforeEach(async () => {
    t = await tiendaLista();
  });

  it('inmediato: compra → comprobante → aprobado → preparación → retiro → entregado', async () => {
    const { id } = await pedidoHasta(t, 'pago_aprobado');
    for (const estado of ['en_preparacion', 'listo_retirar', 'entregado'])
      await avanzar(id, estado);
    expect(await stockDe(t.productos.medialuna)).toEqual({ stock: 3, stockReservado: 0 });
    const r = (await t.panel.get('/panel/caja/resumen')).body;
    expect(r.movimientos).toHaveLength(1); // entregar un inmediato no suma otro ingreso
    expect(r.ingresos).toBe(70000);
  });

  it('encargo con seña: seña por transferencia + resto en efectivo = total, sin tocar stock', async () => {
    const { id, total } = await pedidoHasta(t, 'pago_aprobado', 'encargo');
    await avanzar(id, 'en_preparacion');
    await avanzar(id, 'listo_retirar');
    await t.panel.post('/panel/caja/abrir', { montoApertura: 0 }).expect(201);
    await avanzar(id, 'entregado', { medioCobro: 'efectivo' });
    const r = (await t.panel.get('/panel/caja/resumen')).body;
    expect(r).toMatchObject({
      ingresos: total,
      ingresosTransferencia: 840000,
      ingresosEfectivo: total - 840000,
    });
    expect(await stockDe(t.productos.rogel)).toEqual({ stock: 0, stockReservado: 0 });
    expect((await t.panel.get('/panel/caja')).body.esperado).toBe(total - 840000);
  });
});
