import type { RequestHandler } from 'express';
import { tiendaDelPanel } from '../../../shared/http/contextoPanel.js';
import { esquemaDia, esquemaVenta } from './schemas.js';
import { crearVenta } from './venta.service.js';
import { ventasDelDia } from './ventasDelDia.js';

const cobrar: RequestHandler = async (req, res) => {
  res
    .status(201)
    .json(await crearVenta(tiendaDelPanel(req), esquemaVenta.parse(req.body)));
};

const delDia: RequestHandler = async (req, res) => {
  const { dia } = esquemaDia.parse(req.query);
  res.json(await ventasDelDia(tiendaDelPanel(req), dia));
};

export const ventasController = { cobrar, delDia };
