import { Router, type RequestHandler } from 'express';
import { recibirArchivo } from '../../../shared/archivos/recibirArchivo.js';
import { tiendaDelPanel } from '../../../shared/http/contextoPanel.js';
import { limite } from '../../../shared/http/rateLimit.js';
import { esquemaToken } from '../../pedidos/schemas.js';
import { esquemaId } from '../../pedidos/schemasPanel.js';
import { subirFotoReferencia } from './subirFoto.service.js';
import { verFotoReferencia } from './verFoto.service.js';

const subir: RequestHandler = async (req, res) => {
  const token = esquemaToken.parse(req.params.token);
  const itemId = esquemaId.parse(req.params.itemId);
  res
    .status(201)
    .json(await subirFotoReferencia(req.tienda!.id, token, itemId, req.file!.buffer));
};

const ver: RequestHandler = async (req, res) => {
  const pedidoId = esquemaId.parse(req.params.id);
  const itemId = esquemaId.parse(req.params.itemId);
  res.json(await verFotoReferencia(tiendaDelPanel(req), pedidoId, itemId));
};

// Público: el comprador suma la foto desde su link (rate limit, sección 7).
export function rutasFotosPublico(): Router {
  return Router().post(
    '/pedidos/:token/items/:itemId/foto',
    limite(10, 10),
    recibirArchivo('foto'),
    subir,
  );
}

// Panel (acceso lo pone rutasPanel): ver la foto con URL firmada.
export function rutasFotosPanel(): Router {
  return Router().get('/pedidos/:id/items/:itemId/foto', ver);
}
