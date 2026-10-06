import request from 'supertest';
import { beforeEach, describe, it } from 'vitest';
import { crearApp } from '../../../app.js';
import { crearCuentaCompleta } from '../../../test/flujoAuth.js';
import { limpiarBase } from '../../../test/limpiarBase.js';
import { crearMailerFalso } from '../../../test/mailerFalso.js';
import { origenTienda } from '../../../test/sesionHttp.js';

const ORIGEN = origenTienda('dona-rosa');
const nuevaApp = (correo = crearMailerFalso()) => ({
  app: crearApp({ pingDb: async () => {}, mailer: correo.mailer }),
  correo,
});

describe('logout', () => {
  beforeEach(limpiarBase);

  it('logout invalida la cookie', async () => {
    const { app, correo } = nuevaApp();
    const cuenta = await crearCuentaCompleta(app, correo, 'dona-rosa');
    const salir = request(app).post('/auth/logout').set('Origin', ORIGEN);
    await salir.set('Cookie', cuenta.cookie).expect(204);
    await request(app)
      .get('/auth/yo')
      .set('Origin', ORIGEN)
      .set('Cookie', cuenta.cookie)
      .expect(401);
  });
});
