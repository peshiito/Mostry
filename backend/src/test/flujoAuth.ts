import type { Express } from 'express';
import request from 'supertest';
import { crearMailerFalso } from './mailerFalso.js';
import { codigoTotp, cookieDe, ORIGEN_SITIO, origenTienda } from './sesionHttp.js';

type Correo = ReturnType<typeof crearMailerFalso>;
export const CLAVE = 'una-clave-bien-larga';

export async function registrarYVerificar(app: Express, correo: Correo, slug: string) {
  const email = `${slug}@test.com`;
  const datos = { email, clave: CLAVE, nombre: 'Rosa', nombreNegocio: 'Doña Rosa', slug };
  await request(app)
    .post('/auth/registro')
    .set('Origin', ORIGEN_SITIO)
    .send(datos)
    .expect(201);
  const codigo = correo.ultimoCodigo(email);
  await request(app)
    .post('/auth/verificar-email')
    .set('Origin', ORIGEN_SITIO)
    .send({ email, codigo })
    .expect(200);
  return email;
}

export const login = (app: Express, slug: string, email: string, clave = CLAVE) =>
  request(app)
    .post('/auth/login')
    .set('Origin', origenTienda(slug))
    .send({ email, clave });

// Registro → verificación → login → configurar TOTP → sesión completa.
// El TOTP de activación usa el paso anterior (-1) para dejar libres el actual y el siguiente.
export async function crearCuentaCompleta(app: Express, correo: Correo, slug: string) {
  const email = await registrarYVerificar(app, correo, slug);
  const parcial = cookieDe(await login(app, slug, email).expect(200));
  const conTienda = (r: request.Test) =>
    r.set('Origin', origenTienda(slug)).set('Cookie', parcial);
  const { body } = await conTienda(request(app).post('/auth/totp/preparar')).expect(200);
  const activacion = await conTienda(request(app).post('/auth/totp/activar'))
    .send({ codigoTotp: codigoTotp(body.secreto, -1) })
    .expect(200);
  return {
    email,
    secreto: body.secreto as string,
    cookie: cookieDe(activacion),
    codigosRecuperacion: activacion.body.codigosRecuperacion as string[],
  };
}
