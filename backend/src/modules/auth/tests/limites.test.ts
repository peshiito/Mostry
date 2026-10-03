import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { crearApp } from '../../../app.js';
import { CLAVE, login, registrarYVerificar } from '../../../test/flujoAuth.js';
import { limpiarBase } from '../../../test/limpiarBase.js';
import { crearMailerFalso } from '../../../test/mailerFalso.js';

const nuevaApp = (correo = crearMailerFalso()) => ({
  app: crearApp({ pingDb: async () => {}, mailer: correo.mailer }),
  correo,
});

describe('rate limit y acceso al admin', () => {
  beforeEach(limpiarBase);

  it('frena la fuerza bruta: 5 intentos por email cada 15 minutos', async () => {
    const { app, correo } = nuevaApp();
    const email = await registrarYVerificar(app, correo, 'dona-rosa');
    for (let i = 0; i < 5; i++)
      await login(app, 'dona-rosa', email, 'mala-clave-123').expect(401);
    const bloqueado = await login(app, 'dona-rosa', email);
    expect(bloqueado.status).toBe(429);
    expect(bloqueado.body.error.codigo).toBe('demasiados_intentos');
  });

  it('el usuario normal no puede entrar al admin', async () => {
    const { app, correo } = nuevaApp();
    const email = await registrarYVerificar(app, correo, 'dona-rosa');
    const admin = request(app)
      .post('/auth/login')
      .set('Origin', 'http://admin.localhost:5173');
    await admin.send({ email, clave: CLAVE }).expect(401);
  });
});
