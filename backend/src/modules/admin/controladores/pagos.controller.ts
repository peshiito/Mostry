import type { RequestHandler } from 'express';
import { esquemaId, esquemaPago } from '../schemas.js';
import { metricas } from '../servicios/metricas.service.js';
import { registrarPago } from '../servicios/pagos.service.js';

const registrar: RequestHandler = async (req, res) => {
  const datos = esquemaPago.parse(req.body);
  const tiendaId = esquemaId.parse(req.params.id);
  res.status(201).json(await registrarPago(tiendaId, req.sesion!.usuarioId, datos));
};

const verMetricas: RequestHandler = async (_req, res) => {
  res.json(await metricas());
};

export const pagosController = { registrar, verMetricas };
