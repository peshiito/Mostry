import type { Express } from 'express';
import request from 'supertest';
import { crearMailerFalso } from './mailerFalso.js';
import { cookieDe, ORIGEN_SITIO, origenTienda } from './sesionHttp.js';

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

// Registro → verificación → login: devuelve la cookie de la sesión del panel.
export async function crearCuentaCompleta(app: Express, correo: Correo, slug: string) {
  const email = await registrarYVerificar(app, correo, slug);
  const cookie = cookieDe(await login(app, slug, email).expect(200));
  return { email, cookie };
}
