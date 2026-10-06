import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { enArgentina } from '../../../shared/utils/horaArgentina.js';
import { appConCuenta } from '../../../test/appConCuenta.js';
import { crearCuentaCompleta } from '../../../test/flujoAuth.js';
import { panel } from '../../../test/panel.js';

const enDias = (n: number) => enArgentina(new Date(Date.now() + n * 86_400_000)).fecha;

describe('panel: feriados', () => {
  let ctx: Awaited<ReturnType<typeof appConCuenta>>;

  beforeEach(async () => {
    ctx = await appConCuenta();
  });

  it('agrega, lista desde hoy, no repite y quita', async () => {
    const res = await ctx.panel
      .post('/panel/feriados', { fecha: enDias(5), motivo: 'Vacaciones' })
      .expect(201);
    await ctx.panel.post('/panel/feriados', { fecha: enDias(5) }).expect(409);
    await ctx.panel.post('/panel/feriados', { fecha: enDias(2) }).expect(201);
    const lista = (await ctx.panel.get('/panel/feriados').expect(200)).body;
    expect(lista.map((f: { fecha: string }) => f.fecha)).toEqual([enDias(2), enDias(5)]);
    await ctx.panel.delete(`/panel/feriados/${res.body.id}`).expect(204);
    await ctx.panel.delete(`/panel/feriados/${res.body.id}`).expect(404);
  });

  it('no acepta fechas pasadas ni inválidas', async () => {
    await ctx.panel.post('/panel/feriados', { fecha: enDias(-1) }).expect(400);
    await ctx.panel.post('/panel/feriados', { fecha: '2026-02-30' }).expect(400);
    await ctx.panel.post('/panel/feriados', { fecha: '25/12/2026' }).expect(400);
  });

  it('otra tienda no ve ni borra mis feriados', async () => {
    const { id } = (await ctx.panel.post('/panel/feriados', { fecha: enDias(3) })).body;
    const martin = await crearCuentaCompleta(ctx.app, ctx.correo, 'heladeria');
    const ajeno = panel(ctx.app, 'heladeria', martin.cookie);
    expect((await ajeno.get('/panel/feriados')).body).toEqual([]);
    await ajeno.delete(`/panel/feriados/${id}`).expect(404);
    await ajeno.put('/panel/horarios', { tramos: [] }).expect(200);
    expect(await db.selectFrom('feriados').select('id').execute()).toHaveLength(1);
  });

  it('suspendida: puede ver pero no cambiar horarios ni feriados', async () => {
    await db
      .updateTable('tiendas')
      .set({ suspendidaManual: true, motivoSuspension: 'x' })
      .execute();
    await ctx.panel.get('/panel/horarios').expect(200);
    await ctx.panel.put('/panel/horarios', { tramos: [] }).expect(403);
    await ctx.panel.post('/panel/feriados', { fecha: enDias(3) }).expect(403);
  });
});
