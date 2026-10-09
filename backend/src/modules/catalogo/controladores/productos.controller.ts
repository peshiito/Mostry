import { tiendaDelPanel } from '../../../shared/http/contextoPanel.js';
import type { RequestHandler } from 'express';
import {
  esquemaEditarProducto,
  esquemaFiltros,
  esquemaId,
  esquemaNuevoProducto,
} from '../schemas.js';
import { listarProductos } from '../servicios/listadoProductos.service.js';
import {
  crearProducto,
  editarProducto,
  verProducto,
} from '../servicios/productos.service.js';

const listar: RequestHandler = async (req, res) => {
  res.json(await listarProductos(tiendaDelPanel(req), esquemaFiltros.parse(req.query)));
};

const ver: RequestHandler = async (req, res) => {
  res.json(await verProducto(tiendaDelPanel(req), esquemaId.parse(req.params.id)));
};

const crear: RequestHandler = async (req, res) => {
  res
    .status(201)
    .json(await crearProducto(tiendaDelPanel(req), esquemaNuevoProducto.parse(req.body)));
};

// Desactivar es editar con { activo: false }: los productos nunca se borran.
const editar: RequestHandler = async (req, res) => {
  const id = esquemaId.parse(req.params.id);
  res.json(
    await editarProducto(tiendaDelPanel(req), id, esquemaEditarProducto.parse(req.body)),
  );
};

export const productosController = { listar, ver, crear, editar };
