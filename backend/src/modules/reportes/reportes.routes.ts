import { Router } from 'express';
import { recibirArchivo } from '../../shared/archivos/recibirArchivo.js';
import { limite, porUsuario } from '../../shared/http/rateLimit.js';
import { reportesController as c } from './reportes.controller.js';

// Panel: el comercio reporta un problema a Mostry (y ve cómo va).
export function rutasReportes(): Router {
  const r = Router();
  r.get('/reportes', c.listar);
  r.post('/reportes', limite(60, 5, porUsuario), c.crear);
  r.put(
    '/reportes/:id/captura',
    limite(60, 10, porUsuario),
    recibirArchivo('captura'),
    c.captura,
  );
  return r;
}
