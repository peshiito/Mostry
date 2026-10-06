import type { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { crearApp } from '../../../app.js';
import { crearCuentaCompleta, login } from '../../../test/flujoAuth.js';
import { limpiarBase } from '../../../test/limpiarBase.js';
import { crearMailerFalso } from '../../../test/mailerFalso.js';
import { ORIGEN_SITIO, origenTienda } from '../../../test/sesionHttp.js';

const NUEVA = 'otra-clave-bien-larga';

describe('recuperar contraseña (código por email)', () => {
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

  it('con el código del email cambia la clave y cierra todas las sesiones', async () => {
    const codigo = await pedirCodigo();
    await post('/auth/recuperar/confirmar', {
      email: cuenta.email,
      codigo,
      claveNueva: NUEVA,
    }).expect(200);

    const yo = request(app).get('/auth/yo').set('Origin', origenTienda('dona-rosa'));
    await yo.set('Cookie', cuenta.cookie).expect(401);
    await login(app, 'dona-rosa', cuenta.email).expect(401);
    await login(app, 'dona-rosa', cuenta.email, NUEVA).expect(200);
    expect(correo.enviados.at(-1)?.asunto).toBe('Cambiaste tu contraseña de Mostry');
  });

  it('con un código equivocado no cambia nada', async () => {
    await pedirCodigo();
    const datos = { email: cuenta.email, codigo: '000000', claveNueva: NUEVA };
    await post('/auth/recuperar/confirmar', datos).expect(400);
    await login(app, 'dona-rosa', cuenta.email).expect(200);
  });

  it('el código sirve una sola vez', async () => {
    const codigo = await pedirCodigo();
    const datos = { email: cuenta.email, codigo, claveNueva: NUEVA };
    await post('/auth/recuperar/confirmar', datos).expect(200);
    await post('/auth/recuperar/confirmar', {
      ...datos,
      claveNueva: 'tercera-clave-larga',
    }).expect(400);
  });
});
