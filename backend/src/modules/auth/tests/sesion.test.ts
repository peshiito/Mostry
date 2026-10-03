import request from 'supertest';
import { beforeEach, describe, it } from 'vitest';
import { crearApp } from '../../../app.js';
import { db } from '../../../shared/db/db.js';
import { CLAVE, crearCuentaCompleta, login } from '../../../test/flujoAuth.js';
import { limpiarBase } from '../../../test/limpiarBase.js';
import { crearMailerFalso } from '../../../test/mailerFalso.js';
import { codigoTotp, origenTienda } from '../../../test/sesionHttp.js';

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

  it('cambiar la clave pide la actual + TOTP y cierra las otras sesiones', async () => {
    const { app, correo } = nuevaApp();
    const cuenta = await crearCuentaCompleta(app, correo, 'dona-rosa');
    const cambiar = (body: object) =>
      request(app)
        .post('/auth/cambiar-clave')
        .set('Origin', ORIGEN)
        .set('Cookie', cuenta.cookie)
        .send(body);
    const nueva = { claveActual: CLAVE, claveNueva: 'clave-nueva-larguisima' };

    await cambiar({ ...nueva, codigoTotp: '000000' }).expect(400);
    await cambiar({ ...nueva, codigoTotp: codigoTotp(cuenta.secreto) }).expect(200);
    await login(app, 'dona-rosa', cuenta.email, 'clave-nueva-larguisima').expect(200);
  });

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
