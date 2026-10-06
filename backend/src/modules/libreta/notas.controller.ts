import type { RequestHandler } from 'express';
import { AppError } from '../../shared/errors/AppError.js';
import * as e from './libreta.schemas.js';
import { notasRepo } from './notas.repository.js';

const notaNoEncontrada = () =>
  new AppError(404, 'nota_no_encontrada', 'No encontramos esa nota.');

export const notas: RequestHandler = async (req, res) => {
  res.json(await notasRepo.listar(req.tienda!.id));
};
export const crearNota: RequestHandler = async (req, res) => {
  const id = await notasRepo.crear(req.tienda!.id, e.esquemaNota.parse(req.body).texto);
  res.status(201).json({ id });
};
export const editarNota: RequestHandler = async (req, res) => {
  const ok = await notasRepo.editar(
    req.tienda!.id,
    e.esquemaId.parse(req.params.id),
    e.esquemaNota.parse(req.body).texto,
  );
  if (!ok) throw notaNoEncontrada();
  res.status(204).end();
};
export const borrarNota: RequestHandler = async (req, res) => {
  if (!(await notasRepo.borrar(req.tienda!.id, e.esquemaId.parse(req.params.id))))
    throw notaNoEncontrada();
  res.status(204).end();
};
