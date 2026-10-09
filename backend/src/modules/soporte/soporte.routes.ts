import { Router, type RequestHandler } from 'express';
import { tiendaDelPanel } from '../../shared/http/contextoPanel.js';
import { miembroDelPanel } from '../../shared/http/miembroDelPanel.js';
import { cortarAcceso, darAcceso, estadoSoporte } from './soporte.service.js';

const ver: RequestHandler = async (req, res) => {
  res.json(await estadoSoporte(tiendaDelPanel(req)));
};
const dar: RequestHandler = async (req, res) => {
  res.json(await darAcceso(tiendaDelPanel(req), miembroDelPanel(req)));
};
const cortar: RequestHandler = async (req, res) => {
  res.json(await cortarAcceso(tiendaDelPanel(req)));
};

// Panel: el comercio da (1 hora), ve y corta el permiso de soporte.
export function rutasSoportePanel(): Router {
  const r = Router();
  r.get('/soporte', ver);
  r.post('/soporte/acceso', dar);
  r.delete('/soporte/acceso', cortar);
  return r;
}
