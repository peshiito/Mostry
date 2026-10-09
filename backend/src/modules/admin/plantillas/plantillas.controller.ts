import type { RequestHandler } from 'express';
import { z } from 'zod';
import { CLAVES_PLANTILLA } from './plantillasBase.js';
import {
  guardarPlantilla,
  restaurarPlantilla,
  verPlantillas,
} from './plantillas.service.js';

const esquemaClave = z.enum(CLAVES_PLANTILLA);
const esquemaTexto = z.strictObject({ texto: z.string().trim().min(1).max(1000) });

const listar: RequestHandler = async (_req, res) => {
  res.json(await verPlantillas());
};

const guardar: RequestHandler = async (req, res) => {
  const clave = esquemaClave.parse(req.params.clave);
  res.json(await guardarPlantilla(clave, esquemaTexto.parse(req.body).texto));
};

const restaurar: RequestHandler = async (req, res) => {
  res.json(await restaurarPlantilla(esquemaClave.parse(req.params.clave)));
};

export const plantillasController = { listar, guardar, restaurar };
