import { beforeEach, describe, expect, it } from 'vitest';
import { crearCuentaCompleta } from '../../../test/flujoAuth.js';
import { panel } from '../../../test/panel.js';
import { pedido, tiendaLista } from '../../../test/tiendaLista.js';

const enDias = (d: number) => new Date(Date.now() + d * 86_400_000).toISOString();

describe('encargos: calendario y disponibilidad', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;

  beforeEach(async () => {
    t = await tiendaLista();
  });

  it('el calendario lista los encargos por fecha, con sus ítems; no los cancelados ni los de otra tienda', async () => {
    for (const dias of [5, 2]) {
      await t.comprador
        .post(
          '/publico/pedidos',
          pedido(
            t.productos,
            { rogel: 1 },
            { tipo: 'encargo', fechaEncargo: enDias(dias) },
          ),
        )
        .expect(201);
    }
    await t.comprador
      .post('/publico/pedidos', pedido(t.productos, { medialuna: 1 }))
      .expect(201);
    const lista = (await t.panel.get('/panel/encargos').expect(200)).body;
    expect(lista.map((e: { numero: number }) => e.numero)).toEqual([2, 1]);
    expect(lista[0].items).toEqual([{ nombre: 'Rogel', cantidad: 1 }]);
    const martin = await crearCuentaCompleta(t.app, t.correo, 'heladeria');
    expect(
      (await panel(t.app, 'heladeria', martin.cookie).get('/panel/encargos')).body,
    ).toEqual([]);
  });

  it('disponibilidad pública: con horario 24 h, mañana está disponible', async () => {
    const maniana = new Date(Date.now() + 2 * 86_400_000).toISOString().slice(0, 10);
    const res = await t.comprador
      .get(`/publico/encargos/disponibilidad?fecha=${maniana}`)
      .expect(200);
    expect(res.body).toMatchObject({ disponible: true });
    await t.comprador.get('/publico/encargos/disponibilidad?fecha=mañana').expect(400);
  });
});
