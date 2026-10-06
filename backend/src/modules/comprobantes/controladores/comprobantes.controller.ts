import type { RequestHandler } from 'express';
import { esquemaToken } from '../../pedidos/schemas.js';
import { esquemaAprobacion, esquemaId, esquemaRechazo } from '../schemas.js';
import { listarComprobantes, verArchivo } from '../servicios/archivo.service.js';
import { rechazarComprobante } from '../servicios/rechazar.service.js';
import { aprobarComprobante } from '../servicios/revisar.service.js';
import { subirComprobante } from '../servicios/subirComprobante.service.js';

const ids = (params: Record<string, string>) =>
  [esquemaId.parse(params.id), esquemaId.parse(params.cid)] as const;

const listar: RequestHandler = async (req, res) => {
  res.json(await listarComprobantes(req.tienda!.id, esquemaId.parse(req.params.id)));
};

const archivo: RequestHandler = async (req, res) => {
  const [pedidoId, id] = ids(req.params as Record<string, string>);
  res.json(await verArchivo(req.tienda!.id, pedidoId, id));
};

const aprobar: RequestHandler = async (req, res) => {
  const [pedidoId, id] = ids(req.params as Record<string, string>);
  const datos = esquemaAprobacion.parse(req.body);
  res.json(
    await aprobarComprobante(req.tienda!.id, pedidoId, id, req.sesion!.usuarioId, datos),
  );
};

const rechazar: RequestHandler = async (req, res) => {
  const [pedidoId, id] = ids(req.params as Record<string, string>);
  const { motivo } = esquemaRechazo.parse(req.body);
  res.json(
    await rechazarComprobante(
      req.tienda!.id,
      pedidoId,
      id,
      req.sesion!.usuarioId,
      motivo,
    ),
  );
};

const subir: RequestHandler = async (req, res) => {
  const token = esquemaToken.parse(req.params.token);
  res.status(201).json(await subirComprobante(req.tienda!.id, token, req.file!.buffer));
};

export const comprobantesController = { listar, archivo, aprobar, rechazar, subir };
