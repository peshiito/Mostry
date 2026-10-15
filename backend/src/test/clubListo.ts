import type { Express } from 'express';
import request from 'supertest';
import { crearApp } from '../app.js';
import { CLAVE } from './flujoAuth.js';
import { limpiarBase } from './limpiarBase.js';
import { crearMailerFalso } from './mailerFalso.js';
import { cookieDe, ORIGEN_SITIO } from './sesionHttp.js';

type Correo = ReturnType<typeof crearMailerFalso>;

export const datosCliente = (extra = {}) => ({
  email: 'ana@test.com',
  clave: CLAVE,
  nombre: 'Ana',
  whatsapp: '11 5555-1234',
  aceptoTerminos: true,
  ...extra,
});

// Pedidos al club desde mostry.com.ar, con o sin la cookie del cliente.
export const club = (app: Express, cookie?: string) => {
  const conCookie = (t: request.Test) =>
    (cookie ? t.set('Cookie', cookie) : t).set('Origin', ORIGEN_SITIO);
  return {
    get: (ruta: string) => conCookie(request(app).get(`/club${ruta}`)),
    post: (ruta: string, body: object = {}) =>
      conCookie(request(app).post(`/club${ruta}`)).send(body),
    patch: (ruta: string, body: object) =>
      conCookie(request(app).patch(`/club${ruta}`)).send(body),
    delete: (ruta: string, body: object) =>
      conCookie(request(app).delete(`/club${ruta}`)).send(body),
  };
};

// Registro → código del mail → verificación: devuelve la cookie del club.
export async function registrarCliente(app: Express, correo: Correo, extra = {}) {
  const datos = datosCliente(extra);
  await club(app).post('/registro', datos).expect(201);
  const codigo = correo.ultimoCodigo(datos.email);
  const res = await club(app)
    .post('/verificar-email', { email: datos.email, codigo, clave: datos.clave })
    .expect(200);
  return { email: datos.email, cookie: cookieDe(res) };
}

// Base limpia + app + una clienta del club con su sesión.
export async function clubListo() {
  await limpiarBase();
  const correo = crearMailerFalso();
  const app = crearApp({ pingDb: async () => {}, mailer: correo.mailer });
  const ana = await registrarCliente(app, correo);
  return { app, correo, ana, club: (c = ana.cookie) => club(app, c) };
}
