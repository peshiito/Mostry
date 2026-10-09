import { tiendaDelPanel } from '../../../shared/http/contextoPanel.js';
import type { RequestHandler } from 'express';
import { esquemaConfig, esquemaPausa } from '../schemas.js';
import { editarConfig, pausarTienda, verConfig } from '../servicios/config.service.js';
import { verSuscripcion } from '../servicios/suscripcion.service.js';

const ver: RequestHandler = async (req, res) => {
  res.json(await verConfig(tiendaDelPanel(req)));
};

const editar: RequestHandler = async (req, res) => {
  res.json(await editarConfig(tiendaDelPanel(req), esquemaConfig.parse(req.body)));
};

const pausa: RequestHandler = async (req, res) => {
  res.json(await pausarTienda(tiendaDelPanel(req), esquemaPausa.parse(req.body).pausada));
};

const suscripcion: RequestHandler = async (req, res) => {
  res.json(await verSuscripcion(tiendaDelPanel(req)));
};

export const tiendaController = { ver, editar, pausa, suscripcion };
