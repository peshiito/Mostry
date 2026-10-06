import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { appConCuenta } from '../../../test/appConCuenta.js';
import { crearCuentaCompleta } from '../../../test/flujoAuth.js';
import { panel } from '../../../test/panel.js';

describe('caja: resumen del período', () => {
  let ctx: Awaited<ReturnType<typeof appConCuenta>>;

  beforeEach(async () => {
    ctx = await appConCuenta();
  });

  it('ganancia real = ingresos − gastos; las inversiones van aparte (decisión 37)', async () => {
    const { id: tiendaId } = (await ctx.panel.get('/panel/tienda/config')).body;
    await ctx.panel.post('/panel/caja/movimientos', {
      tipo: 'ingreso',
      medio: 'transferencia',
      monto: 1_000_000,
      concepto: 'ventas',
    });
    const ahora = new Date();
    await db
      .insertInto('gastos')
      .values([
        { tiendaId, tipo: 'gasto', monto: 300_000, medio: 'transferencia', fecha: ahora },
        {
          tiendaId,
          tipo: 'inversion',
          monto: 5_000_000,
          medio: 'transferencia',
          fecha: ahora,
        },
      ])
      .execute();
    const r = (await ctx.panel.get('/panel/caja/resumen').expect(200)).body;
    expect(r).toMatchObject({
      ingresos: 1_000_000,
      gastos: 300_000,
      inversiones: 5_000_000,
      gananciaReal: 700_000,
    });
  });

  it('valida el período y otra tienda no ve mis movimientos', async () => {
    await ctx.panel
      .get('/panel/caja/resumen?desde=2026-10-10&hasta=2026-10-01')
      .expect(400);
    await ctx.panel
      .get('/panel/caja/resumen?desde=2024-01-01&hasta=2026-01-01')
      .expect(400);
    await ctx.panel.post('/panel/caja/movimientos', {
      tipo: 'ingreso',
      medio: 'transferencia',
      monto: 5,
      concepto: 'mío',
    });
    const martin = await crearCuentaCompleta(ctx.app, ctx.correo, 'heladeria');
    const ajeno = panel(ctx.app, 'heladeria', martin.cookie);
    expect((await ajeno.get('/panel/caja/resumen')).body.movimientos).toEqual([]);
    expect((await ajeno.get('/panel/caja')).body).toBeNull();
  });
});
