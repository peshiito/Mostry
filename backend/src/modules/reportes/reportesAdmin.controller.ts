import type { RequestHandler } from 'express';
import { esquemaFiltro, esquemaId, esquemaRespuesta } from './schemas.js';
import {
  bandejaReportes,
  detalleReporte,
  responderReporte,
} from './reportesAdmin.service.js';

const listar: RequestHandler = async (req, res) => {
  res.json(await bandejaReportes(esquemaFiltro.parse(req.query).estado));
};

const detalle: RequestHandler = async (req, res) => {
  res.json(await detalleReporte(esquemaId.parse(req.params.id)));
};

const responder: RequestHandler = async (req, res) => {
  const id = esquemaId.parse(req.params.id);
  res.json(await responderReporte(id, esquemaRespuesta.parse(req.body)));
};

export const reportesAdminController = { listar, detalle, responder };
