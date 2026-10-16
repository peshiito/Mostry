import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { VERSION_LEGAL } from '../../../config/legal.js';
import { db } from '../../../shared/db/db.js';
import { appConCuenta } from '../../../test/appConCuenta.js';
import { CLAVE } from '../../../test/flujoAuth.js';
import { ORIGEN_SITIO, origenTienda } from '../../../test/sesionHttp.js';

const datos = {
  email: 'o@test.com',
  clave: CLAVE,
  nombre: 'Otra',
  nombreNegocio: 'Otra',
  slug: 'otra',
};

// S2: el registro exige aceptar los términos y deja constancia de la versión.
// Si la versión cambia, el panel lo pide de nuevo (terminosPendientes).
describe('aceptación de términos y privacidad', () => {
  let ctx: Awaited<ReturnType<typeof appConCuenta>>;
  const conSesion = (r: request.Test) =>
    r.set('Origin', origenTienda('dona-rosa')).set('Cookie', ctx.cuenta.cookie);
  const yo = () => conSesion(request(ctx.app).get('/auth/yo'));
  const aceptar = (version: string) =>
    conSesion(request(ctx.app).post('/auth/terminos')).send({ version });
  const usuario = () =>
    db
      .selectFrom('usuarios')
      .select(['terminosVersion', 'terminosAceptadosEn'])
      .executeTakeFirstOrThrow();

  beforeEach(async () => {
    ctx = await appConCuenta();
  });

  it('el registro guarda la versión aceptada y no queda nada pendiente', async () => {
    const u = await usuario();
    expect(u.terminosVersion).toBe(VERSION_LEGAL);
    expect(u.terminosAceptadosEn).toBeInstanceOf(Date);
    expect((await yo().expect(200)).body.usuario.terminosPendientes).toBe(false);
  });

  it('sin aceptar los términos no hay registro', async () => {
    const registrar = (body: object) =>
      request(ctx.app).post('/auth/registro').set('Origin', ORIGEN_SITIO).send(body);
    await registrar(datos).expect(400);
    await registrar({ ...datos, aceptoTerminos: false }).expect(400);
    await registrar({ ...datos, aceptoTerminos: true }).expect(201);
  });

  it('con una versión vieja queda pendiente hasta aceptar la vigente', async () => {
    await db.updateTable('usuarios').set({ terminosVersion: '2020-01-01' }).execute();
    expect((await yo().expect(200)).body.usuario.terminosPendientes).toBe(true);
    const r = await aceptar('2020-01-01').expect(409);
    expect(r.body.error.codigo).toBe('version_vieja');
    await aceptar(VERSION_LEGAL).expect(200);
    expect((await yo().expect(200)).body.usuario.terminosPendientes).toBe(false);
    expect((await usuario()).terminosVersion).toBe(VERSION_LEGAL);
  });

  it('sin sesión no se puede aceptar', async () => {
    await request(ctx.app)
      .post('/auth/terminos')
      .set('Origin', origenTienda('dona-rosa'))
      .send({ version: VERSION_LEGAL })
      .expect(401);
  });
});
