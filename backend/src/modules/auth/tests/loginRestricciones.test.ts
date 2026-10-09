import type { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { crearApp } from '../../../app.js';
import { CLAVE, login, registrarYVerificar } from '../../../test/flujoAuth.js';
import { limpiarBase } from '../../../test/limpiarBase.js';
import { crearMailerFalso } from '../../../test/mailerFalso.js';
import { ORIGEN_SITIO } from '../../../test/sesionHttp.js';

describe('login: restricciones', () => {
  let app: Express;
  let correo: ReturnType<typeof crearMailerFalso>;

  beforeEach(async () => {
    await limpiarBase();
    correo = crearMailerFalso();
    app = crearApp({ pingDb: async () => {}, mailer: correo.mailer });
  });

  it('no deja entrar a una tienda ajena; sin Origin de Mostry, tampoco', async () => {
    const email = await registrarYVerificar(app, correo, 'dona-rosa');
    await registrarYVerificar(app, correo, 'heladeria');
    await login(app, 'heladeria', email).expect(401);
    const sinOrigen = request(app).post('/auth/login').set('Origin', 'https://otro.com');
    await sinOrigen.send({ email, clave: CLAVE }).expect(403);
  });

  it('pide verificar el email antes de entrar', async () => {
    const datos = {
      email: 'r@test.com',
      clave: CLAVE,
      nombre: 'Rosa',
      nombreNegocio: 'Rosa',
      slug: 'rosa',
    };
    await request(app)
      .post('/auth/registro')
      .set('Origin', ORIGEN_SITIO)
      .send(datos)
      .expect(201);
    const res = await login(app, 'rosa', 'r@test.com');
    expect(res.status).toBe(403);
    expect(res.body.error.codigo).toBe('email_sin_verificar');
  });
});
