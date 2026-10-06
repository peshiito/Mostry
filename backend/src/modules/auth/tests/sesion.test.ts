import request from 'supertest';
import { beforeEach, describe, it } from 'vitest';
import { crearApp } from '../../../app.js';
import { db } from '../../../shared/db/db.js';
import { CLAVE, crearCuentaCompleta, login } from '../../../test/flujoAuth.js';
import { cookieDe } from '../../../test/sesionHttp.js';
import { limpiarBase } from '../../../test/limpiarBase.js';
import { crearMailerFalso } from '../../../test/mailerFalso.js';
import { origenTienda } from '../../../test/sesionHttp.js';

const ORIGEN = origenTienda('dona-rosa');
const nuevaApp = (correo = crearMailerFalso()) => ({
  app: crearApp({ pingDb: async () => {}, mailer: correo.mailer }),
  correo,
});

describe('sesiones y cambio de clave', () => {
  beforeEach(limpiarBase);

  it('una sesión vencida deja de servir', async () => {
    const { app, correo } = nuevaApp();
    const cuenta = await crearCuentaCompleta(app, correo, 'dona-rosa');
    await db
      .updateTable('sesiones')
      .set({ expiraEn: new Date(Date.now() - 1000) })
      .execute();
    await request(app)
      .get('/auth/yo')
      .set('Origin', ORIGEN)
      .set('Cookie', cuenta.cookie)
      .expect(401);
  });

  it('cambiar la clave pide la actual y cierra las otras sesiones', async () => {
    const { app, correo } = nuevaApp();
    const cuenta = await crearCuentaCompleta(app, correo, 'dona-rosa');
    const cambiar = (body: object) =>
      request(app)
        .post('/auth/cambiar-clave')
        .set('Origin', ORIGEN)
        .set('Cookie', cuenta.cookie)
        .send(body);
    const claveNueva = 'clave-nueva-larguisima';
    const otra = await login(app, 'dona-rosa', cuenta.email).expect(200);

    await cambiar({ claveActual: 'no-es-la-clave', claveNueva }).expect(400);
    await cambiar({ claveActual: CLAVE, claveNueva }).expect(200);
    await request(app)
      .get('/auth/yo')
      .set('Origin', ORIGEN)
      .set('Cookie', cookieDe(otra))
      .expect(401);
    // La sesión desde la que se cambió sigue andando.
    await request(app)
      .get('/auth/yo')
      .set('Origin', ORIGEN)
      .set('Cookie', cuenta.cookie)
      .expect(200);
    await login(app, 'dona-rosa', cuenta.email, 'clave-nueva-larguisima').expect(200);
  });
});
