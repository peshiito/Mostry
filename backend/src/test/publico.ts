import type { Express } from 'express';
import request from 'supertest';
import { origenTienda } from './sesionHttp.js';

// Requests de un comprador (sin cookie) a la tienda pública de un subdominio.
export function publico(app: Express, slug: string) {
  return {
    get: (ruta: string) => request(app).get(ruta).set('Origin', origenTienda(slug)),
    post: (ruta: string, body: object) =>
      request(app).post(ruta).set('Origin', origenTienda(slug)).send(body),
  };
}
