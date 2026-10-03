import request from 'supertest';
import { beforeEach, describe, it } from 'vitest';
import { crearAdminLogueado, ORIGEN_ADMIN } from '../../../test/adminCompleto.js';
import { appConCuenta } from '../../../test/appConCuenta.js';
import { panel } from '../../../test/panel.js';

describe('acceso al admin', () => {
  let ctx: Awaited<ReturnType<typeof appConCuenta>>;

  beforeEach(async () => {
    ctx = await appConCuenta('dona-rosa');
  });

  it('el admin logueado entra', async () => {
    const admin = await crearAdminLogueado(ctx.app);
    await admin.get('/admin/tiendas').expect(200);
    await admin.get('/admin/metricas').expect(200);
  });

  it('una comerciante NO entra (escalada de privilegios)', async () => {
    // Desde su tienda, con su cookie de panel: sesión válida pero no es admin.
    await panel(ctx.app, 'dona-rosa', ctx.cuenta.cookie)
      .get('/admin/tiendas')
      .expect(403);
    // Desde el origen del admin, su cookie de panel ni se lee.
    const desdeAdmin = request(ctx.app).get('/admin/tiendas').set('Origin', ORIGEN_ADMIN);
    await desdeAdmin.set('Cookie', ctx.cuenta.cookie).expect(401);
  });

  it('sin sesión no hay acceso', async () => {
    await request(ctx.app).get('/admin/tiendas').set('Origin', ORIGEN_ADMIN).expect(401);
  });
});
