import { tiendaDelPanel } from '../../../shared/http/contextoPanel.js';
import type { RequestHandler } from 'express';
import { esquemaId } from '../schemas.js';
import { esquemaOrdenFotos } from '../schemasOrden.js';
import { agregarFoto, borrarFoto, listarFotos } from '../servicios/fotos.service.js';
import { ordenarFotos } from '../servicios/ordenFotos.service.js';

const agregar: RequestHandler = async (req, res) => {
  const productoId = esquemaId.parse(req.params.id);
  res
    .status(201)
    .json(await agregarFoto(tiendaDelPanel(req), productoId, req.file!.buffer));
};

const listar: RequestHandler = async (req, res) => {
  res.json(await listarFotos(tiendaDelPanel(req), esquemaId.parse(req.params.id)));
};

const borrar: RequestHandler = async (req, res) => {
  const [productoId, fotoId] = [
    esquemaId.parse(req.params.id),
    esquemaId.parse(req.params.fotoId),
  ];
  await borrarFoto(tiendaDelPanel(req), productoId, fotoId);
  res.status(204).end();
};

const ordenar: RequestHandler = async (req, res) => {
  const { ids } = esquemaOrdenFotos.parse(req.body);
  res.json(await ordenarFotos(tiendaDelPanel(req), esquemaId.parse(req.params.id), ids));
};

export const fotosController = { agregar, listar, borrar, ordenar };
