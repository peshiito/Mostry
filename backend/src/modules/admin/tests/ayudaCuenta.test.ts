import { beforeEach, describe, expect, it } from 'vitest';
import { crearAdminLogueado } from '../../../test/adminCompleto.js';
import { appConCuenta } from '../../../test/appConCuenta.js';
import { login } from '../../../test/flujoAuth.js';

// Mejoras 4: el admin corrige el email del dueño y los datos de la tienda.
describe('admin: ayudar con la cuenta', () => {
  let ctx: Awaited<ReturnType<typeof appConCuenta>>;
  let admin: Awaited<ReturnType<typeof crearAdminLogueado>>;
  let id: number;

  beforeEach(async () => {
    ctx = await appConCuenta('dona-rosa');
    admin = await crearAdminLogueado(ctx.app);
    id = (await ctx.panel.get('/panel/tienda/config')).body.id;
  });

  it('cambia el email: cierra las sesiones y entra con el nuevo', async () => {
    await admin
      .patch(`/admin/tiendas/${id}/dueno`, { email: 'rosa@nuevo.com' })
      .expect(200);
    await ctx.panel.get('/panel/tienda/config').expect(401);
    await login(ctx.app, 'dona-rosa', 'rosa@nuevo.com').expect(200);
    const enUso = await admin.patch(`/admin/tiendas/${id}/dueno`, {
      email: 'admin@mostry.test',
    });
    expect(enUso.status).toBe(409);
    expect(enUso.body.error.codigo).toBe('email_en_uso');
  });

  it('corrige el link: valida reservados y la tienda se ve en el nuevo', async () => {
    await admin.patch(`/admin/tiendas/${id}/datos`, { slug: 'admin' }).expect(400);
    await admin.patch(`/admin/tiendas/${id}/datos`, { slug: 'dona-rosita' }).expect(200);
    await login(ctx.app, 'dona-rosita', ctx.cuenta.email).expect(200);
    await login(ctx.app, 'dona-rosa', ctx.cuenta.email).expect(401);
  });

  it('un comerciante no puede usar la ayuda del admin', async () => {
    const r = await ctx.panel.patch(`/admin/tiendas/${id}/datos`, { nombre: 'Otra' });
    expect([401, 403]).toContain(r.status);
  });
});
