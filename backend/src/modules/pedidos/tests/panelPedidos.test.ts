import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { pedido, tiendaLista } from '../../../test/tiendaLista.js';

describe('panel: pedidos', () => {
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

  it('lista y muestra el detalle con ítems y el link de WhatsApp armado', async () => {
    await crear(pedido(t.productos, { medialuna: 2 }));
    const lista = (await t.panel.get('/panel/pedidos').expect(200)).body;
    expect(lista).toMatchObject({
      total: 1,
      pedidos: [{ numero: 1, estado: 'pendiente_pago', total: 70000 }],
    });
    const detalle = (
      await t.panel.get(`/panel/pedidos/${lista.pedidos[0].id}`).expect(200)
    ).body;
    expect(detalle.items).toEqual([
      {
        productoId: t.productos.medialuna,
        nombre: 'Medialuna',
        precioUnitario: 35000,
        cantidad: 2,
        subtotal: 70000,
      },
    ]);
    expect(detalle.whatsapp).toMatch(/^https:\/\/wa\.me\/5491123456789\?text=/);
    expect(decodeURIComponent(detalle.whatsapp)).toMatch(/transferí \$\s700/);
    expect(detalle).not.toHaveProperty('tokenSeguimiento');
  });

  it('encargo sin seña: confirmar → preparar → listo para retirar; entregar pide cobrar el resto', async () => {
    await db.updateTable('tiendas').set({ senaPorcentaje: 0 }).execute();
    const fecha = new Date(Date.now() + 3 * 86_400_000).toISOString();
    await crear(
      pedido(t.productos, { rogel: 1 }, { tipo: 'encargo', fechaEncargo: fecha }),
    );
    const id = await idDe(1);
    const avanzar = (estado: string) =>
      t.panel.post(`/panel/pedidos/${id}/estado`, { estado });
    await avanzar('en_preparacion').expect(409);
    for (const estado of ['confirmado', 'en_preparacion', 'listo_retirar'])
      await avanzar(estado).expect(200);
    expect((await avanzar('entregado').expect(409)).body.error.codigo).toBe(
      'falta_cobrar',
    );
  });
});
