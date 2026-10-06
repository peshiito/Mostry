import type { RequestHandler } from 'express';
import { esquemaCheckout, esquemaToken } from '../schemas.js';
import { crearPedido } from '../servicios/checkout.service.js';
import { verSeguimiento } from '../servicios/seguimiento.service.js';

const crear: RequestHandler = async (req, res) => {
  res
    .status(201)
    .json(await crearPedido(req.tienda!.id, esquemaCheckout.parse(req.body)));
};

const seguimiento: RequestHandler = async (req, res) => {
  res.json(await verSeguimiento(req.tienda!.id, esquemaToken.parse(req.params.token)));
};

export const pedidosPublicoController = { crear, seguimiento };
