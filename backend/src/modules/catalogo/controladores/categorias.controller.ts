import type { RequestHandler } from 'express';
import { esquemaCategoria, esquemaId } from '../schemas.js';
import { esquemaOrden } from '../schemasOrden.js';
import * as servicio from '../servicios/categorias.service.js';
import { reordenarCategorias } from '../servicios/ordenCategorias.service.js';

const listar: RequestHandler = async (req, res) => {
  res.json(await servicio.listarCategorias(req.tienda!.id));
};

const crear: RequestHandler = async (req, res) => {
  const { nombre } = esquemaCategoria.parse(req.body);
  res.status(201).json(await servicio.crearCategoria(req.tienda!.id, nombre));
};

const renombrar: RequestHandler = async (req, res) => {
  const { nombre } = esquemaCategoria.parse(req.body);
  res.json(
    await servicio.renombrarCategoria(
      req.tienda!.id,
      esquemaId.parse(req.params.id),
      nombre,
    ),
  );
};

const reordenar: RequestHandler = async (req, res) => {
  const { ids } = esquemaOrden.parse(req.body);
  res.json(await reordenarCategorias(req.tienda!.id, ids));
};

const borrar: RequestHandler = async (req, res) => {
  await servicio.borrarCategoria(req.tienda!.id, esquemaId.parse(req.params.id));
  res.status(204).end();
};

export const categoriasController = { listar, crear, renombrar, reordenar, borrar };
