import type { Express } from 'express';
import request from 'supertest';
import { hashearClave } from '../shared/crypto/claves.js';
import { db } from '../shared/db/db.js';
import { CLAVE } from './flujoAuth.js';
import { cookieDe } from './sesionHttp.js';

export const ORIGEN_ADMIN = 'http://admin.localhost:5173';

// Inserta un usuario admin con el email verificado (clave: CLAVE).
export async function crearUsuarioAdmin(email = 'admin@mostry.test') {
  const hashClave = await hashearClave(CLAVE);
  const datos = { email, nombre: 'Admin', hashClave, esAdmin: true };
  await db
    .insertInto('usuarios')
    .values({ ...datos, emailVerificadoEn: new Date() })
    .execute();
  return email;
}

// Crea un admin verificado y lo loguea. Devuelve helpers con su cookie.
export async function crearAdminLogueado(app: Express) {
  const email = await crearUsuarioAdmin();

  const conAdmin = (r: request.Test, cookie?: string) =>
    cookie
      ? r.set('Origin', ORIGEN_ADMIN).set('Cookie', cookie)
      : r.set('Origin', ORIGEN_ADMIN);
  const login = await conAdmin(request(app).post('/auth/login')).send({
    email,
    clave: CLAVE,
  });
  const cookie = cookieDe(login);
  return {
    cookie,
    get: (ruta: string) => conAdmin(request(app).get(ruta), cookie),
    post: (ruta: string, body: object = {}) =>
      conAdmin(request(app).post(ruta), cookie).send(body),
    put: (ruta: string, body: object = {}) =>
      conAdmin(request(app).put(ruta), cookie).send(body),
    patch: (ruta: string, body: object = {}) =>
      conAdmin(request(app).patch(ruta), cookie).send(body),
    delete: (ruta: string) => conAdmin(request(app).delete(ruta), cookie),
  };
}
