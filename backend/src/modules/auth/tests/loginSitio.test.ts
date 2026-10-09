import type { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { crearApp } from '../../../app.js';
import { crearUsuarioAdmin, ORIGEN_ADMIN } from '../../../test/adminCompleto.js';
import { CLAVE, registrarYVerificar } from '../../../test/flujoAuth.js';
import { limpiarBase } from '../../../test/limpiarBase.js';
import { crearMailerFalso } from '../../../test/mailerFalso.js';
import { cookieDe, ORIGEN_SITIO, origenTienda } from '../../../test/sesionHttp.js';

// Ingresar desde la landing (mostry.com.ar): el admin va a su dashboard y el
// comerciante a su tienda. Mismo error genérico si algo no cuadra.
describe('login desde la landing', () => {
  let app: Express;
  let correo: ReturnType<typeof crearMailerFalso>;
  const entrar = (email: string, clave = CLAVE) =>
    request(app).post('/auth/login').set('Origin', ORIGEN_SITIO).send({ email, clave });

  beforeEach(async () => {
    await limpiarBase();
    correo = crearMailerFalso();
    app = crearApp({ pingDb: async () => {}, mailer: correo.mailer });
  });

  it('el comerciante recibe su sesión y la lista de sus tiendas', async () => {
    const email = await registrarYVerificar(app, correo, 'dona-rosa');
    const res = await entrar(email).expect(200);
    expect(res.body.destino).toEqual({
      zona: 'tiendas',
      tiendas: [{ slug: 'dona-rosa', nombre: expect.any(String) }],
    });
    expect(res.headers['set-cookie']?.[0]).toMatch(/^__Host-mostry_sesion=/);
    // Esa sesión sirve en su panel, pero no en el admin.
    const cookie = cookieDe(res);
    const panel = request(app).get('/panel/tienda/config');
    await panel
      .set('Origin', origenTienda('dona-rosa'))
      .set('Cookie', cookie)
      .expect(200);
    const admin = request(app).get('/admin/tiendas').set('Origin', ORIGEN_ADMIN);
    await admin.set('Cookie', cookie).expect(401);
  });

  it('el admin recibe la sesión de admin y va a su dashboard', async () => {
    await crearUsuarioAdmin('a@mostry.test');
    const res = await entrar('a@mostry.test').expect(200);
    expect(res.body.destino).toEqual({ zona: 'admin' });
    const cookie = cookieDe(res);
    expect(cookie).toMatch(/^__Host-mostry_admin=/);
    const admin = request(app).get('/admin/tiendas').set('Origin', ORIGEN_ADMIN);
    await admin.set('Cookie', cookie).expect(200);
  });

  it('clave mala o email inexistente: el mismo error, sin pistas', async () => {
    const email = await registrarYVerificar(app, correo, 'dona-rosa');
    const mala = await entrar(email, 'otra-clave-cualquiera').expect(401);
    const nadie = await entrar('nadie@test.com').expect(401);
    expect(mala.body).toEqual(nadie.body);
  });
});
