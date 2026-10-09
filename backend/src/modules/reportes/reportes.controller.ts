import type { RequestHandler } from 'express';
import { tiendaDelPanel } from '../../shared/http/contextoPanel.js';
import { miembroDelPanel } from '../../shared/http/miembroDelPanel.js';
import { esquemaId, esquemaReporte } from './schemas.js';
import { adjuntarCaptura, crearReporte, listarReportes } from './reportes.service.js';

const crear: RequestHandler = async (req, res) => {
  const datos = esquemaReporte.parse(req.body);
  const tiendaId = tiendaDelPanel(req);
  const usuarioId = miembroDelPanel(req);
  res
    .status(201)
    .json(await crearReporte(tiendaId, usuarioId, datos, req.get('user-agent')));
};

const listar: RequestHandler = async (req, res) => {
  res.json(await listarReportes(tiendaDelPanel(req)));
};

const captura: RequestHandler = async (req, res) => {
  const id = esquemaId.parse(req.params.id);
  res.json(await adjuntarCaptura(tiendaDelPanel(req), id, req.file!.buffer));
};

export const reportesController = { crear, listar, captura };
