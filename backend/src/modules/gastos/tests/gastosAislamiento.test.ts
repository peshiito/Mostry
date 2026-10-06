import { beforeEach, describe, expect, it } from 'vitest';
import { appConCuenta } from '../../../test/appConCuenta.js';
import { crearCuentaCompleta } from '../../../test/flujoAuth.js';
import { panel } from '../../../test/panel.js';

describe('gastos: aislamiento y validaciones', () => {
  let ctx: Awaited<ReturnType<typeof appConCuenta>>;

  beforeEach(async () => {
    ctx = await appConCuenta('dona-rosa');
  });

  it('no se puede usar ni editar un proveedor de otra tienda', async () => {
    const martin = await crearCuentaCompleta(ctx.app, ctx.correo, 'heladeria');
    const heladeria = panel(ctx.app, 'heladeria', martin.cookie);
    const ajeno = (await heladeria.post('/panel/proveedores', { nombre: 'Lácteos SA' }))
      .body.id;
    await ctx.panel.patch(`/panel/proveedores/${ajeno}`, { activo: false }).expect(404);
    const res = await ctx.panel.post('/panel/gastos', {
      tipo: 'gasto',
      monto: 1,
      medio: 'transferencia',
      proveedorId: ajeno,
    });
    expect(res.body.error.codigo).toBe('proveedor_invalido');
    expect((await heladeria.get('/panel/gastos')).body).toEqual([]);
  });

  it('valida montos, tipos y campos de más', async () => {
    for (const malo of [
      { monto: 0 },
      { tipo: 'sueldo' },
      { medio: 'cheque' },
      { origen: 'manual' },
    ]) {
      await ctx.panel
        .post('/panel/gastos', {
          tipo: 'gasto',
          monto: 1,
          medio: 'transferencia',
          ...malo,
        })
        .expect(400);
    }
    await ctx.panel.get('/panel/gastos?desde=2026-10-10&hasta=2026-10-01').expect(400);
  });
});
