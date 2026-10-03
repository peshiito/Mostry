import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { appConCuenta } from '../../../test/appConCuenta.js';
import { crearCuentaCompleta } from '../../../test/flujoAuth.js';
import { panel } from '../../../test/panel.js';

describe('Mi tienda: aislamiento entre tiendas', () => {
  let ctx: Awaited<ReturnType<typeof appConCuenta>>;

  beforeEach(async () => {
    ctx = await appConCuenta('dona-rosa');
    await crearCuentaCompleta(ctx.app, ctx.correo, 'heladeria');
  });

  it('con la sesión de Rosa no se puede ver ni editar la heladería', async () => {
    const ajeno = panel(ctx.app, 'heladeria', ctx.cuenta.cookie);
    await ajeno.get('/tienda/config').expect(403);
    await ajeno.patch('/tienda/config', { nombre: 'Robada' }).expect(403);
    await ajeno.put('/tienda/pausa', { pausada: true }).expect(403);
    const heladeria = await db
      .selectFrom('tiendas')
      .select(['nombre', 'pausada'])
      .where('slug', '=', 'heladeria')
      .executeTakeFirstOrThrow();
    expect(heladeria).toEqual({ nombre: 'Doña Rosa', pausada: false });
  });

  it('sin sesión no hay acceso', async () => {
    await panel(ctx.app, 'dona-rosa', '').get('/tienda/config').expect(401);
  });
});
