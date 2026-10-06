import type { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { crearApp } from '../../../app.js';
import {
  crearCuentaCompleta,
  login,
  registrarYVerificar,
} from '../../../test/flujoAuth.js';
import { limpiarBase } from '../../../test/limpiarBase.js';
import { crearMailerFalso } from '../../../test/mailerFalso.js';
import { origenTienda } from '../../../test/sesionHttp.js';

describe('login con email y contraseña', () => {
  let app: Express;
  let correo: ReturnType<typeof crearMailerFalso>;
  const yo = (cookie: string, slug = 'dona-rosa') =>
    request(app).get('/auth/yo').set('Origin', origenTienda(slug)).set('Cookie', cookie);

  beforeEach(async () => {
    await limpiarBase();
    correo = crearMailerFalso();
    app = crearApp({ pingDb: async () => {}, mailer: correo.mailer });
  });

  it('registro → verificación → login deja una sesión que sirve', async () => {
    const cuenta = await crearCuentaCompleta(app, correo, 'dona-rosa');
    const res = await yo(cuenta.cookie).expect(200);
    expect(res.body.tiendas).toEqual([
      expect.objectContaining({ slug: 'dona-rosa', rol: 'dueno' }),
    ]);
  });

  it('la cookie de una tienda no sirve en otra', async () => {
    const cuenta = await crearCuentaCompleta(app, correo, 'dona-rosa');
    await registrarYVerificar(app, correo, 'otra-tienda');
    await request(app)
      .get('/panel/tienda/config')
      .set('Origin', origenTienda('otra-tienda'))
      .set('Cookie', cuenta.cookie)
      .expect(403);
  });

  it('clave incorrecta y email inexistente dan exactamente el mismo error', async () => {
    const email = await registrarYVerificar(app, correo, 'dona-rosa');
    const malaClave = await login(app, 'dona-rosa', email, 'clave-incorrecta-123');
    const noExiste = await login(app, 'dona-rosa', 'nadie@test.com');
    expect(malaClave.status).toBe(401);
    expect(noExiste.status).toBe(401);
    expect(malaClave.body).toEqual(noExiste.body);
  });
});
