import type { RequestHandler } from 'express';
import { quitarLogo, subirLogo } from '../servicios/logo.service.js';

const subir: RequestHandler = async (req, res) => {
  res.json(await subirLogo(req.tienda!.id, req.file!.buffer));
};

const quitar: RequestHandler = async (req, res) => {
  await quitarLogo(req.tienda!.id);
  res.status(204).end();
};

export const logoController = { subir, quitar };
