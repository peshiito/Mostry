import request from 'supertest';
import { beforeEach, describe, it } from 'vitest';
import { crearApp } from '../../../app.js';
import { CLAVE } from '../../../test/flujoAuth.js';
import { limpiarBase } from '../../../test/limpiarBase.js';
import { crearMailerFalso } from '../../../test/mailerFalso.js';
import { ORIGEN_SITIO } from '../../../test/sesionHttp.js';

const email = 'rosa@test.com';
const registro = {
  email,
  clave: CLAVE,
  nombre: 'Rosa',
  nombreNegocio: 'Doña Rosa',
  slug: 'dona-rosa',
};

describe('reenvío del código de verificación', () => {
  let correo: ReturnType<typeof crearMailerFalso>;
  let post: (ruta: string, body: object) => request.Test;

  beforeEach(async () => {
    await limpiarBase();
    correo = crearMailerFalso();
    const app = crearApp({ pingDb: async () => {}, mailer: correo.mailer });
    post = (ruta, body) => request(app).post(ruta).set('Origin', ORIGEN_SITIO).send(body);
    await post('/auth/registro', registro).expect(201);
  });

  it('reenviar invalida el código anterior', async () => {
    const viejo = correo.ultimoCodigo(email);
    await post('/auth/verificar-email/reenviar', { email }).expect(202);
    const nuevo = correo.ultimoCodigo(email);
    if (viejo !== nuevo)
      await post('/auth/verificar-email', { email, codigo: viejo }).expect(400);
    await post('/auth/verificar-email', { email, codigo: nuevo }).expect(200);
  });
});
