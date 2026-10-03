import type { Express } from 'express';
import request from 'supertest';
import { origenTienda } from './sesionHttp.js';

// Requests al panel de una tienda con la cookie de una sesión.
export function panel(app: Express, slug: string, cookie: string) {
  const con = (r: request.Test) =>
    r.set('Origin', origenTienda(slug)).set('Cookie', cookie);
  return {
    get: (ruta: string) => con(request(app).get(ruta)),
    patch: (ruta: string, body: object) => con(request(app).patch(ruta)).send(body),
    put: (ruta: string, body: object) => con(request(app).put(ruta)).send(body),
  };
}
