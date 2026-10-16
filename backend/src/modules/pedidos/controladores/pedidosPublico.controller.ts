import type { RequestHandler } from 'express';
import { esquemaCheckout, esquemaToken } from '../schemas.js';
import { crearPedido } from '../servicios/checkout.service.js';
import { verSeguimiento } from '../servicios/seguimiento.service.js';
import { despacharAvisos } from '../../avisos/despachar.js';

const crear: RequestHandler = async (req, res) => {
  const tiendaId = req.tienda!.id;
  const datos = esquemaCheckout.parse(req.body);
  res
    .status(201)
    .json(await crearPedido(tiendaId, datos, new Date(), req.cliente?.clienteId ?? null));
  despacharAvisos(tiendaId); // al teléfono del comercio (Avisos 1)
};

const seguimiento: RequestHandler = async (req, res) => {
  res.json(await verSeguimiento(req.tienda!.id, esquemaToken.parse(req.params.token)));
};

export const pedidosPublicoController = { crear, seguimiento };
