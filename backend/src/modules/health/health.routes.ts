import { Router } from 'express';
import { crearHealthController } from './health.controller.js';

export function rutasHealth(pingDb: () => Promise<void>): Router {
  const rutas = Router();
  rutas.get('/', crearHealthController(pingDb));
  return rutas;
}
