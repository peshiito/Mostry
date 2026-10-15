import { Router, type RequestHandler } from 'express';
import { z } from 'zod';
import { tiendaDelPanel } from '../../../shared/http/contextoPanel.js';
import { limite } from '../../../shared/http/rateLimit.js';
import { fichaDeSocio, sociosDe } from '../historial/socios.js';
import { esquemaCodigo, identificarCliente } from './identificar.service.js';

const esquema = z.strictObject({ codigo: esquemaCodigo });

const identificar: RequestHandler = async (req, res) => {
  const { codigo } = esquema.parse(req.body);
  res.json(await identificarCliente(tiendaDelPanel(req), codigo));
};

const idSocio = z.coerce.number().int().positive();
const socios: RequestHandler = async (req, res) => {
  res.json(await sociosDe(tiendaDelPanel(req)));
};
const ficha: RequestHandler = async (req, res) => {
  res.json(await fichaDeSocio(tiendaDelPanel(req), idSocio.parse(req.params.id)));
};

// Identificar a un cliente del club en el local (escaneando su QR o tipeando
// el código). Con límite: adivinar un código vigente tiene que ser inviable.
export function rutasSellosPanel(): Router {
  const r = Router();
  r.post('/club/identificar', limite(15, 40), identificar);
  // Lealtad L5: los socios de ESTA tienda y la ficha de cada uno.
  r.get('/club/socios', socios);
  r.get('/club/socios/:id', ficha);
  return r;
}
