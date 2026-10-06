import type { Express } from 'express';
import request from 'supertest';
import { origenTienda } from './sesionHttp.js';

// Requests al panel de una tienda con la cookie de una sesión.
export function panel(app: Express, slug: string, cookie: string) {
  const con = (r: request.Test) =>
    r.set('Origin', origenTienda(slug)).set('Cookie', cookie);
  return {
    get: (ruta: string) => con(request(app).get(ruta)),
    post: (ruta: string, body: object = {}) => con(request(app).post(ruta)).send(body),
    patch: (ruta: string, body: object) => con(request(app).patch(ruta)).send(body),
    put: (ruta: string, body: object) => con(request(app).put(ruta)).send(body),
    delete: (ruta: string) => con(request(app).delete(ruta)),
    // multipart/form-data: el nombre y el tipo son mentiras posibles; el backend no los usa.
    subir: (
      metodo: 'post' | 'put',
      ruta: string,
      campo: string,
      datos: Buffer,
      nombre = 'foto.jpg',
    ) =>
      con(request(app)[metodo](ruta)).attach(campo, datos, {
        filename: nombre,
        contentType: 'image/jpeg',
      }),
  };
}
