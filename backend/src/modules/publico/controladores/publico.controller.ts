import type { RequestHandler } from 'express';
import { esquemaFiltrosPublicos, esquemaId } from '../schemas.js';
import {
  listarCatalogo,
  listarCategoriasPublicas,
  verProductoPublico,
} from '../servicios/catalogoPublico.service.js';
import { verTiendaPublica } from '../servicios/tiendaPublica.service.js';

const tienda: RequestHandler = async (req, res) => {
  res.json(await verTiendaPublica(req.tienda!.id));
};

const categorias: RequestHandler = async (req, res) => {
  res.json(await listarCategoriasPublicas(req.tienda!.id));
};

const productos: RequestHandler = async (req, res) => {
  const { pagina, ...filtros } = esquemaFiltrosPublicos.parse(req.query);
  res.json(await listarCatalogo(req.tienda!.id, filtros, pagina));
};

const producto: RequestHandler = async (req, res) => {
  res.json(await verProductoPublico(req.tienda!.id, esquemaId.parse(req.params.id)));
};

export const publicoController = { tienda, categorias, productos, producto };
