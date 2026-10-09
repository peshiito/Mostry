import { tiendaDelPanel } from '../../../shared/http/contextoPanel.js';
import type { RequestHandler } from 'express';
import { esquemaCategoria, esquemaId } from '../schemas.js';
import { esquemaOrden } from '../schemasOrden.js';
import * as servicio from '../servicios/categorias.service.js';
import { reordenarCategorias } from '../servicios/ordenCategorias.service.js';

const listar: RequestHandler = async (req, res) => {
  res.json(await servicio.listarCategorias(tiendaDelPanel(req)));
};

const crear: RequestHandler = async (req, res) => {
  const { nombre } = esquemaCategoria.parse(req.body);
  res.status(201).json(await servicio.crearCategoria(tiendaDelPanel(req), nombre));
};

const renombrar: RequestHandler = async (req, res) => {
  const { nombre } = esquemaCategoria.parse(req.body);
  res.json(
    await servicio.renombrarCategoria(
      tiendaDelPanel(req),
      esquemaId.parse(req.params.id),
      nombre,
    ),
  );
};

const reordenar: RequestHandler = async (req, res) => {
  const { ids } = esquemaOrden.parse(req.body);
  res.json(await reordenarCategorias(tiendaDelPanel(req), ids));
};

const borrar: RequestHandler = async (req, res) => {
  await servicio.borrarCategoria(tiendaDelPanel(req), esquemaId.parse(req.params.id));
  res.status(204).end();
};

export const categoriasController = { listar, crear, renombrar, reordenar, borrar };
