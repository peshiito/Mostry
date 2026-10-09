import { tiendaDelPanel } from '../../../shared/http/contextoPanel.js';
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
  res.json(await listarPedidos(tiendaDelPanel(req), filtros, pagina));
};

const ver: RequestHandler = async (req, res) => {
  res.json(await verPedido(tiendaDelPanel(req), esquemaId.parse(req.params.id)));
};

const avanzar: RequestHandler = async (req, res) => {
  const { estado, medioCobro } = esquemaAvanzar.parse(req.body);
  res.json(
    await avanzarPedido(
      tiendaDelPanel(req),
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
      tiendaDelPanel(req),
      esquemaId.parse(req.params.id),
      motivo,
      devolucion,
    ),
  );
};

export const pedidosPanelController = { listar, ver, avanzar, cancelar };
