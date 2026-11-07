import type { RequestHandler } from 'express';
import { esquemaFiltrosPublicos, esquemaId } from '../schemas.js';
import {
  listarCatalogo,
  listarCategoriasPublicas,
  verProductoPublico,
} from '../servicios/catalogoPublico.service.js';
import { leerVistaBorrador } from '../../tiendas/pagina/vistaBorrador.js';
import { verTiendaPublica } from '../servicios/tiendaPublica.service.js';

// Con ?borrador=<token válido para esta tienda> muestra el borrador; un token
// malo o vencido no da error: se ve lo publicado, como cualquier comprador.
const tienda: RequestHandler = async (req, res) => {
  const id = req.tienda!.id;
  res.json(await verTiendaPublica(id, leerVistaBorrador(id, req.query.borrador)));
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
