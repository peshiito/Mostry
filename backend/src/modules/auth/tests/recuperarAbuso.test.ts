import type { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { crearApp } from '../../../app.js';
import { crearCuentaCompleta, login } from '../../../test/flujoAuth.js';
import { limpiarBase } from '../../../test/limpiarBase.js';
import { crearMailerFalso } from '../../../test/mailerFalso.js';
import { ORIGEN_SITIO } from '../../../test/sesionHttp.js';

const NUEVA = 'otra-clave-bien-larga';

describe('recuperar contraseña: intentos y enumeración', () => {
  let app: Express;
  let correo: ReturnType<typeof crearMailerFalso>;
  let cuenta: Awaited<ReturnType<typeof crearCuentaCompleta>>;
  const post = (ruta: string, body: object) =>
    request(app).post(ruta).set('Origin', ORIGEN_SITIO).send(body);
  const pedirCodigo = async () => {
    await post('/auth/recuperar', { email: cuenta.email }).expect(202);
    return correo.ultimoCodigo(cuenta.email)!;
  };

  beforeEach(async () => {
    await limpiarBase();
    correo = crearMailerFalso();
    app = crearApp({ pingDb: async () => {}, mailer: correo.mailer });
    cuenta = await crearCuentaCompleta(app, correo, 'dona-rosa');
  });

  // Dos frenos: el límite por email (5 cada 15 min) y los 5 intentos del código.
  it('después de muchos intentos fallidos ya no se puede adivinar', async () => {
    const codigo = await pedirCodigo();
    const datos = { email: cuenta.email, claveNueva: NUEVA };
    for (let i = 0; i < 5; i++)
      await post('/auth/recuperar/confirmar', { ...datos, codigo: '000000' });
    const final = await post('/auth/recuperar/confirmar', { ...datos, codigo });
    expect([400, 429]).toContain(final.status);
    await login(app, 'dona-rosa', cuenta.email).expect(200);
  });

  it('un email inexistente da el mismo error que un código equivocado', async () => {
    await pedirCodigo();
    const datos = { codigo: '000000', claveNueva: NUEVA };
    const malo = await post('/auth/recuperar/confirmar', {
      ...datos,
      email: cuenta.email,
    });
    const nadie = await post('/auth/recuperar/confirmar', {
      ...datos,
      email: 'x@test.com',
    });
    expect([malo.status, nadie.status]).toEqual([400, 400]);
    expect(nadie.body).toEqual(malo.body);
  });
});
