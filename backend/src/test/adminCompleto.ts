import type { Express } from 'express';
import request from 'supertest';
import { hashearClave } from '../shared/crypto/claves.js';
import { db } from '../shared/db/db.js';
import { CLAVE } from './flujoAuth.js';
import { cookieDe } from './sesionHttp.js';

export const ORIGEN_ADMIN = 'http://admin.localhost:5173';

// Crea un admin verificado y lo loguea. Devuelve helpers con su cookie.
export async function crearAdminLogueado(app: Express) {
  const email = 'admin@mostry.test';
  const hashClave = await hashearClave(CLAVE);
  const datos = {
    email,
    nombre: 'Admin',
    hashClave,
    esAdmin: true,
    emailVerificadoEn: new Date(),
  };
  await db.insertInto('usuarios').values(datos).execute();

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
    get: (ruta: string) => conAdmin(request(app).get(ruta), cookie),
    post: (ruta: string, body: object = {}) =>
      conAdmin(request(app).post(ruta), cookie).send(body),
  };
}
