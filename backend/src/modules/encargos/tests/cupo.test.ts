import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { enArgentina } from '../../../shared/utils/horaArgentina.js';
import { pedido, tiendaLista } from '../../../test/tiendaLista.js';

const DIA_MS = 86_400_000;
const enDias = (d: number, horas = 0) =>
  new Date(Date.now() + d * DIA_MS + horas * 3_600_000);

// Encargos 2: la tienda pone un máximo de encargos por día.
describe('encargos: cupo por día', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;
  const encargar = (fecha: Date) =>
    t.comprador.post(
      '/publico/pedidos',
      pedido(
        t.productos,
        { rogel: 1 },
        { tipo: 'encargo', fechaEncargo: fecha.toISOString() },
      ),
    );

  beforeEach(async () => {
    t = await tiendaLista();
    await t.panel.patch('/panel/tienda/config', { cupoEncargosDia: 1 }).expect(200);
  });

  it('se configura y se puede sacar (vacío = sin límite)', async () => {
    expect((await t.panel.get('/panel/tienda/config')).body.cupoEncargosDia).toBe(1);
    await t.panel.patch('/panel/tienda/config', { cupoEncargosDia: null }).expect(200);
    expect((await t.panel.get('/panel/tienda/config')).body.cupoEncargosDia).toBeNull();
  });

  it('lleno el día no entra otro; un cancelado libera su lugar', async () => {
    const dia = enDias(3);
    await encargar(dia).expect(201);
    const res = await encargar(new Date(dia.getTime() + 60_000)).expect(409);
    expect(res.body.error.codigo).toBe('sin_cupo');
    await encargar(enDias(4)).expect(201);
    const fecha = enArgentina(dia).fecha;
    const disp = (
      await t.comprador.get(`/publico/encargos/disponibilidad?fecha=${fecha}`)
    ).body;
    expect(disp).toMatchObject({ disponible: false, motivo: 'sin_cupo' });
    const { id } = await db
      .selectFrom('pedidos')
      .select('id')
      .where('numero', '=', 1)
      .executeTakeFirstOrThrow();
    await t.panel
      .post(`/panel/pedidos/${id}/cancelar`, { motivo: 'Se arrepintió' })
      .expect(200);
    await encargar(dia).expect(201);
  });

  it('diez a la vez por el último lugar: entra uno solo', async () => {
    const dia = enDias(5);
    const res = await Promise.all(Array.from({ length: 10 }, () => encargar(dia)));
    expect(res.filter((r) => r.status === 201)).toHaveLength(1);
    expect(res.filter((r) => r.status === 409)).toHaveLength(9);
  });
});
