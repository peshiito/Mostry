import { tiendaDelPanel } from '../../../shared/http/contextoPanel.js';
import type { RequestHandler } from 'express';
import { quitarLogo, subirLogo } from '../servicios/logo.service.js';

const subir: RequestHandler = async (req, res) => {
  res.json(await subirLogo(tiendaDelPanel(req), req.file!.buffer));
};

const quitar: RequestHandler = async (req, res) => {
  await quitarLogo(tiendaDelPanel(req));
  res.status(204).end();
};

export const logoController = { subir, quitar };
