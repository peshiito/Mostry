import type { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { crearApp } from '../../../app.js';
import { crearCuentaCompleta, login } from '../../../test/flujoAuth.js';
import { limpiarBase } from '../../../test/limpiarBase.js';
import { crearMailerFalso } from '../../../test/mailerFalso.js';
import { codigoTotp, cookieDe, origenTienda } from '../../../test/sesionHttp.js';

const ORIGEN = origenTienda('dona-rosa');

describe('login (paso 2): TOTP y códigos de recuperación', () => {
  let app: Express;
  let cuenta: Awaited<ReturnType<typeof crearCuentaCompleta>>;
  const paso2 = (cookie: string, body: object) =>
    request(app)
      .post('/auth/login/totp')
      .set('Origin', ORIGEN)
      .set('Cookie', cookie)
      .send(body);
  const yo = (cookie: string) =>
    request(app).get('/auth/yo').set('Origin', ORIGEN).set('Cookie', cookie);
  const nuevoLogin = async () =>
    cookieDe(await login(app, 'dona-rosa', cuenta.email).expect(200));

  beforeEach(async () => {
    await limpiarBase();
    const correo = crearMailerFalso();
    app = crearApp({ pingDb: async () => {}, mailer: correo.mailer });
    cuenta = await crearCuentaCompleta(app, correo, 'dona-rosa');
  });

  it('con el código de la app completa la sesión y cambia el token', async () => {
    const parcial = await nuevoLogin();
    const res = await paso2(parcial, { codigoTotp: codigoTotp(cuenta.secreto) }).expect(
      200,
    );
    const completa = cookieDe(res);
    expect(completa).not.toBe(parcial);
    await yo(completa).expect(200);
    await yo(parcial).expect(401);
  });

  it('un código TOTP no se puede usar dos veces (anti-replay)', async () => {
    const codigo = codigoTotp(cuenta.secreto);
    await paso2(await nuevoLogin(), { codigoTotp: codigo }).expect(200);
    await paso2(await nuevoLogin(), { codigoTotp: codigo }).expect(400);
  });

  it('cada código de recuperación sirve una sola vez', async () => {
    const [codigo] = cuenta.codigosRecuperacion;
    await paso2(await nuevoLogin(), { codigoRecuperacion: codigo }).expect(200);
    await paso2(await nuevoLogin(), { codigoRecuperacion: codigo }).expect(400);
  });

  it('rechaza códigos inventados o mandar los dos factores juntos', async () => {
    const parcial = await nuevoLogin();
    await paso2(parcial, { codigoTotp: '123456' }).expect(400);
    await paso2(parcial, { codigoRecuperacion: 'aaaaa-bbbbb' }).expect(400);
    const ambos = {
      codigoTotp: '123456',
      codigoRecuperacion: cuenta.codigosRecuperacion[1],
    };
    await paso2(parcial, ambos).expect(400);
  });
});
