import type { RequestHandler } from 'express';
import {
  esquemaAvanzar,
  esquemaCancelar,
  esquemaFiltrosPedidos,
  esquemaId,
} from '../schemasPanel.js';
import { listarPedidos, verPedido } from '../servicios/panelPedidos.service.js';
import { cancelarPedido } from '../servicios/cancelarPedido.service.js';
import { avanzarPedido } from '../servicios/transiciones.service.js';

const listar: RequestHandler = async (req, res) => {
  const { pagina, ...filtros } = esquemaFiltrosPedidos.parse(req.query);
  res.json(await listarPedidos(req.tienda!.id, filtros, pagina));
};

const ver: RequestHandler = async (req, res) => {
  res.json(await verPedido(req.tienda!.id, esquemaId.parse(req.params.id)));
};

const avanzar: RequestHandler = async (req, res) => {
  const { estado, medioCobro } = esquemaAvanzar.parse(req.body);
  res.json(
    await avanzarPedido(
      req.tienda!.id,
      esquemaId.parse(req.params.id),
      estado,
      medioCobro,
    ),
  );
};

const cancelar: RequestHandler = async (req, res) => {
  const { motivo, devolucion } = esquemaCancelar.parse(req.body);
  res.json(
    await cancelarPedido(
      req.tienda!.id,
      esquemaId.parse(req.params.id),
      motivo,
      devolucion,
    ),
  );
};

export const pedidosPanelController = { listar, ver, avanzar, cancelar };
