import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { crearAdminLogueado } from '../../../test/adminCompleto.js';
import { appConCuenta } from '../../../test/appConCuenta.js';
import { login } from '../../../test/flujoAuth.js';
import { panel } from '../../../test/panel.js';
import { cookieDe, origenTienda } from '../../../test/sesionHttp.js';

describe('admin: clave temporal y reenvío de mail', () => {
  let ctx: Awaited<ReturnType<typeof appConCuenta>>;
  let admin: Awaited<ReturnType<typeof crearAdminLogueado>>;
  let id: number;

  beforeEach(async () => {
    ctx = await appConCuenta('dona-rosa');
    admin = await crearAdminLogueado(ctx.app);
    id = (await ctx.panel.get('/panel/tienda/config')).body.id;
  });

  it('entra con la clave temporal y no usa el panel hasta elegir una nueva', async () => {
    const { body } = await admin.post(`/admin/tiendas/${id}/clave-temporal`).expect(200);
    expect(body.clave).toMatch(/^[a-zA-Z2-9]{10}$/);
    await ctx.panel.get('/panel/tienda/config').expect(401); // se cerró su sesión
    const cookie = cookieDe(
      await login(ctx.app, 'dona-rosa', ctx.cuenta.email, body.clave).expect(200),
    );
    const p = panel(ctx.app, 'dona-rosa', cookie);
    expect((await p.get('/panel/tienda/config').expect(403)).body.error.codigo).toBe(
      'debe_cambiar_clave',
    );
    await request(ctx.app)
      .post('/auth/cambiar-clave')
      .set('Origin', origenTienda('dona-rosa'))
      .set('Cookie', cookie)
      .send({ claveActual: body.clave, claveNueva: 'mi-clave-nueva-123' })
      .expect(200);
    await p.get('/panel/tienda/config').expect(200);
  });

  it('reenvía el mail de recuperación al dueño', async () => {
    const r = await admin.post(`/admin/tiendas/${id}/reenviar-mail`).expect(200);
    expect(r.body).toMatchObject({
      email: ctx.cuenta.email,
      proposito: 'recuperar_clave',
    });
    expect(ctx.correo.ultimoCodigo(ctx.cuenta.email)).toMatch(/^\d{6}$/);
  });
});
