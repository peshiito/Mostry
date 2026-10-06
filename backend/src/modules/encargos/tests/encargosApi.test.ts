import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { enArgentina } from '../../../shared/utils/horaArgentina.js';
import { pedido, tiendaLista } from '../../../test/tiendaLista.js';

const enDias = (d: number) => enArgentina(new Date(Date.now() + d * 86_400_000)).fecha;

describe('encargos por la API: feriados y anticipación reales de la tienda', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;

  beforeEach(async () => {
    t = await tiendaLista();
  });

  it('un feriado cargado en el panel bloquea encargos y la disponibilidad lo informa', async () => {
    const fecha = enDias(3);
    await t.panel.post('/panel/feriados', { fecha, motivo: 'Inventario' }).expect(201);
    const disp = (
      await t.comprador.get(`/publico/encargos/disponibilidad?fecha=${fecha}`).expect(200)
    ).body;
    expect(disp).toMatchObject({ disponible: false, motivo: 'feriado' });
    const encargo = pedido(
      t.productos,
      { rogel: 1 },
      { tipo: 'encargo', fechaEncargo: `${fecha}T11:00:00-03:00` },
    );
    const res = await t.comprador.post('/publico/pedidos', encargo).expect(400);
    expect(res.body.error.detalle).toEqual({ problema: 'feriado_o_fuera_de_horario' });
  });

  it('usa la anticipación configurada en la tienda (48 h: mañana no hay horarios)', async () => {
    await db.updateTable('tiendas').set({ anticipacionEncargoHoras: 48 }).execute();
    const disp = (
      await t.comprador
        .get(`/publico/encargos/disponibilidad?fecha=${enDias(1)}`)
        .expect(200)
    ).body;
    expect(disp).toMatchObject({ disponible: false, motivo: 'anticipacion' });
    expect(
      (await t.comprador.get(`/publico/encargos/disponibilidad?fecha=${enDias(4)}`)).body
        .disponible,
    ).toBe(true);
  });
});
