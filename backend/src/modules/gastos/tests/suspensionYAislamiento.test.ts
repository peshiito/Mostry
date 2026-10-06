import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { appConCuenta } from '../../../test/appConCuenta.js';
import { crearCuentaCompleta } from '../../../test/flujoAuth.js';
import { panel } from '../../../test/panel.js';

describe('gastos, proveedores y libreta: suspensión por fecha y aislamiento', () => {
  let ctx: Awaited<ReturnType<typeof appConCuenta>>;

  beforeEach(async () => {
    ctx = await appConCuenta('dona-rosa');
  });

  it('vencida hace más de 3 días: lee todo pero no escribe nada', async () => {
    const prov = (await ctx.panel.post('/panel/proveedores', { nombre: 'Molino' })).body
      .id;
    const cli = (await ctx.panel.post('/panel/libreta/clientes', { nombre: 'Marta' }))
      .body.id;
    await db
      .updateTable('tiendas')
      .set({ pruebaHasta: new Date(Date.now() - 4 * 86_400_000) })
      .execute();
    const escrituras = [
      ctx.panel.post('/panel/proveedores', { nombre: 'Otro' }),
      ctx.panel.patch(`/panel/proveedores/${prov}`, { activo: false }),
      ctx.panel.post(`/panel/libreta/clientes/${cli}/movimientos`, {
        tipo: 'deuda',
        monto: 1,
      }),
      ctx.panel.post('/panel/libreta/notas', { texto: 'x' }),
    ];
    for (const r of await Promise.all(escrituras))
      expect(r.body.error?.codigo).toBe('tienda_suspendida');
    await ctx.panel.get('/panel/proveedores').expect(200);
    await ctx.panel.get('/panel/libreta/clientes').expect(200);
  });

  it('con datos en las dos tiendas, cada una ve y edita solo lo suyo', async () => {
    const cli = (await ctx.panel.post('/panel/libreta/clientes', { nombre: 'Marta' }))
      .body.id;
    const nota = (await ctx.panel.post('/panel/libreta/notas', { texto: 'Mía' })).body.id;
    await ctx.panel
      .post('/panel/gastos', { tipo: 'gasto', monto: 1000, medio: 'transferencia' })
      .expect(201);
    const martin = await crearCuentaCompleta(ctx.app, ctx.correo, 'heladeria');
    const ajeno = panel(ctx.app, 'heladeria', martin.cookie);
    await ajeno
      .post('/panel/gastos', { tipo: 'gasto', monto: 7, medio: 'transferencia' })
      .expect(201);
    expect(
      (await ajeno.get('/panel/gastos')).body.map((g: { monto: number }) => g.monto),
    ).toEqual([7]);
    await ajeno.patch(`/panel/libreta/clientes/${cli}`, { nombre: 'Robado' }).expect(404);
    await ajeno.patch(`/panel/libreta/notas/${nota}`, { texto: 'Robada' }).expect(404);
    expect((await ctx.panel.get(`/panel/libreta/clientes/${cli}`)).body.nombre).toBe(
      'Marta',
    );
  });
});
