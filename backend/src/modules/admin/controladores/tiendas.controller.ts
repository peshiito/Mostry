import type { RequestHandler } from 'express';
import { esquemaId, esquemaListado, esquemaSuspender } from '../schemas.js';
import { detalleTienda } from '../servicios/detalle.service.js';
import { listarTiendas } from '../servicios/listado.service.js';
import { reactivarTienda, suspenderTienda } from '../servicios/suspension.service.js';

const listar: RequestHandler = async (req, res) => {
  res.json(await listarTiendas(esquemaListado.parse(req.query)));
};

const detalle: RequestHandler = async (req, res) => {
  res.json(await detalleTienda(esquemaId.parse(req.params.id)));
};

const suspender: RequestHandler = async (req, res) => {
  const { motivo } = esquemaSuspender.parse(req.body);
  res.json(
    await suspenderTienda(esquemaId.parse(req.params.id), req.sesion!.usuarioId, motivo),
  );
};

const reactivar: RequestHandler = async (req, res) => {
  res.json(await reactivarTienda(esquemaId.parse(req.params.id), req.sesion!.usuarioId));
};

export const tiendasAdminController = { listar, detalle, suspender, reactivar };
