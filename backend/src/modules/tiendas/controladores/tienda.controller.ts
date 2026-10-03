import type { RequestHandler } from 'express';
import { esquemaConfig, esquemaPausa } from '../schemas.js';
import { editarConfig, pausarTienda, verConfig } from '../servicios/config.service.js';
import { verSuscripcion } from '../servicios/suscripcion.service.js';

const ver: RequestHandler = async (req, res) => {
  res.json(await verConfig(req.tienda!.id));
};

const editar: RequestHandler = async (req, res) => {
  res.json(await editarConfig(req.tienda!.id, esquemaConfig.parse(req.body)));
};

const pausa: RequestHandler = async (req, res) => {
  res.json(await pausarTienda(req.tienda!.id, esquemaPausa.parse(req.body).pausada));
};

const suscripcion: RequestHandler = async (req, res) => {
  res.json(await verSuscripcion(req.tienda!.id));
};

export const tiendaController = { ver, editar, pausa, suscripcion };
