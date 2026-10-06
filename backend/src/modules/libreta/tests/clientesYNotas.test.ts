import { beforeEach, describe, expect, it } from 'vitest';
import { appConCuenta } from '../../../test/appConCuenta.js';
import { crearCuentaCompleta } from '../../../test/flujoAuth.js';
import { panel } from '../../../test/panel.js';

describe('libreta: clientes, notas y aislamiento', () => {
  let ctx: Awaited<ReturnType<typeof appConCuenta>>;

  beforeEach(async () => {
    ctx = await appConCuenta();
  });

  it('clientes: se desactivan (no se borran) y a uno inactivo no se le anota deuda', async () => {
    const { id } = (await ctx.panel.post('/panel/libreta/clientes', { nombre: 'Juan' }))
      .body;
    await ctx.panel.patch(`/panel/libreta/clientes/${id}`, { activo: false }).expect(200);
    expect((await ctx.panel.get('/panel/libreta/clientes')).body).toEqual([]);
    expect(
      (await ctx.panel.get('/panel/libreta/clientes?estado=todos')).body,
    ).toHaveLength(1);
    await ctx.panel
      .post(`/panel/libreta/clientes/${id}/movimientos`, { tipo: 'deuda', monto: 1 })
      .expect(409);
  });

  it('notas: crear, editar y borrar', async () => {
    const { id } = (
      await ctx.panel.post('/panel/libreta/notas', { texto: 'Pedir harina' }).expect(201)
    ).body;
    await ctx.panel
      .patch(`/panel/libreta/notas/${id}`, { texto: 'Pedir harina 0000' })
      .expect(204);
    expect((await ctx.panel.get('/panel/libreta/notas')).body[0].texto).toBe(
      'Pedir harina 0000',
    );
    await ctx.panel.delete(`/panel/libreta/notas/${id}`).expect(204);
    await ctx.panel.delete(`/panel/libreta/notas/${id}`).expect(404);
  });

  it('otra tienda no ve ni toca mis clientes ni mis notas', async () => {
    const cliente = (await ctx.panel.post('/panel/libreta/clientes', { nombre: 'Marta' }))
      .body.id;
    const nota = (await ctx.panel.post('/panel/libreta/notas', { texto: 'Secreto' })).body
      .id;
    const martin = await crearCuentaCompleta(ctx.app, ctx.correo, 'heladeria');
    const ajeno = panel(ctx.app, 'heladeria', martin.cookie);
    await ajeno.get(`/panel/libreta/clientes/${cliente}`).expect(404);
    await ajeno
      .post(`/panel/libreta/clientes/${cliente}/movimientos`, { tipo: 'deuda', monto: 1 })
      .expect(404);
    await ajeno.delete(`/panel/libreta/notas/${nota}`).expect(404);
    expect((await ajeno.get('/panel/libreta/notas')).body).toEqual([]);
  });
});
