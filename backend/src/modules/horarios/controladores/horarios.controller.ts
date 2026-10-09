import { tiendaDelPanel } from '../../../shared/http/contextoPanel.js';
import type { RequestHandler } from 'express';
import { esquemaFeriado, esquemaHorarios, esquemaId } from '../schemas.js';
import * as s from '../servicios/horarios.service.js';

const ver: RequestHandler = async (req, res) => {
  res.json(await s.verHorarios(tiendaDelPanel(req)));
};

const guardar: RequestHandler = async (req, res) => {
  res.json(
    await s.guardarHorarios(tiendaDelPanel(req), esquemaHorarios.parse(req.body).tramos),
  );
};

const estado: RequestHandler = async (req, res) => {
  res.json(await s.estadoTienda(tiendaDelPanel(req)));
};

const feriados: RequestHandler = async (req, res) => {
  res.json(await s.listarFeriados(tiendaDelPanel(req)));
};

const agregarFeriado: RequestHandler = async (req, res) => {
  const { fecha, motivo } = esquemaFeriado.parse(req.body);
  res.status(201).json(await s.agregarFeriado(tiendaDelPanel(req), fecha, motivo));
};

const quitarFeriado: RequestHandler = async (req, res) => {
  await s.quitarFeriado(tiendaDelPanel(req), esquemaId.parse(req.params.id));
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
