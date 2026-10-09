import { tiendaDelPanel } from '../../shared/http/contextoPanel.js';
import type { RequestHandler } from 'express';
import { clientesRepo } from './clientes.repository.js';
import { registrarFiado } from './fiado.service.js';
import { clienteNoEncontrado, verCliente } from './verCliente.js';
import * as e from './libreta.schemas.js';

export const clientes: RequestHandler = async (req, res) => {
  const { buscar, estado } = e.esquemaFiltrosClientes.parse(req.query);
  const filas = await clientesRepo.listar(
    tiendaDelPanel(req),
    buscar,
    estado === 'todos',
  );
  res.json(filas.map((c) => ({ ...c, saldo: Number(c.saldo) })));
};
export const crearCliente: RequestHandler = async (req, res) => {
  const { nombre, telefono } = e.esquemaCliente.parse(req.body);
  res
    .status(201)
    .json(
      await verCliente(
        tiendaDelPanel(req),
        await clientesRepo.crear(tiendaDelPanel(req), nombre, telefono ?? null),
      ),
    );
};
export const cliente: RequestHandler = async (req, res) => {
  res.json(await verCliente(tiendaDelPanel(req), e.esquemaId.parse(req.params.id)));
};
// Se edita o se desactiva (activo: false). No se borra (sección 5).
export const editarCliente: RequestHandler = async (req, res) => {
  const id = e.esquemaId.parse(req.params.id);
  if (!(await clientesRepo.buscar(tiendaDelPanel(req), id))) throw clienteNoEncontrado();
  await clientesRepo.actualizar(
    tiendaDelPanel(req),
    id,
    e.esquemaEditarCliente.parse(req.body),
  );
  res.json(await verCliente(tiendaDelPanel(req), id));
};
export const movimiento: RequestHandler = async (req, res) => {
  const datos = e.esquemaMovimientoFiado.parse(req.body);
  res
    .status(201)
    .json(
      await registrarFiado(tiendaDelPanel(req), e.esquemaId.parse(req.params.id), datos),
    );
};
