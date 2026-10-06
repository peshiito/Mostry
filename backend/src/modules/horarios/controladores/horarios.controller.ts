import type { RequestHandler } from 'express';
import { esquemaFeriado, esquemaHorarios, esquemaId } from '../schemas.js';
import * as s from '../servicios/horarios.service.js';

const ver: RequestHandler = async (req, res) => {
  res.json(await s.verHorarios(req.tienda!.id));
};

const guardar: RequestHandler = async (req, res) => {
  res.json(
    await s.guardarHorarios(req.tienda!.id, esquemaHorarios.parse(req.body).tramos),
  );
};

const estado: RequestHandler = async (req, res) => {
  res.json(await s.estadoTienda(req.tienda!.id));
};

const feriados: RequestHandler = async (req, res) => {
  res.json(await s.listarFeriados(req.tienda!.id));
};

const agregarFeriado: RequestHandler = async (req, res) => {
  const { fecha, motivo } = esquemaFeriado.parse(req.body);
  res.status(201).json(await s.agregarFeriado(req.tienda!.id, fecha, motivo));
};

const quitarFeriado: RequestHandler = async (req, res) => {
  await s.quitarFeriado(req.tienda!.id, esquemaId.parse(req.params.id));
  res.status(204).end();
};

export const horariosController = {
  ver,
  guardar,
  estado,
  feriados,
  agregarFeriado,
  quitarFeriado,
};
