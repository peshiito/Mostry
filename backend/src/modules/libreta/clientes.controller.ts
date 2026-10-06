import type { RequestHandler } from 'express';
import { clientesRepo } from './clientes.repository.js';
import { registrarFiado } from './fiado.service.js';
import { clienteNoEncontrado, verCliente } from './verCliente.js';
import * as e from './libreta.schemas.js';

export const clientes: RequestHandler = async (req, res) => {
  const { buscar, estado } = e.esquemaFiltrosClientes.parse(req.query);
  const filas = await clientesRepo.listar(req.tienda!.id, buscar, estado === 'todos');
  res.json(filas.map((c) => ({ ...c, saldo: Number(c.saldo) })));
};
export const crearCliente: RequestHandler = async (req, res) => {
  const { nombre, telefono } = e.esquemaCliente.parse(req.body);
  res
    .status(201)
    .json(
      await verCliente(
        req.tienda!.id,
        await clientesRepo.crear(req.tienda!.id, nombre, telefono ?? null),
      ),
    );
};
export const cliente: RequestHandler = async (req, res) => {
  res.json(await verCliente(req.tienda!.id, e.esquemaId.parse(req.params.id)));
};
// Se edita o se desactiva (activo: false). No se borra (sección 5).
export const editarCliente: RequestHandler = async (req, res) => {
  const id = e.esquemaId.parse(req.params.id);
  if (!(await clientesRepo.buscar(req.tienda!.id, id))) throw clienteNoEncontrado();
  await clientesRepo.actualizar(
    req.tienda!.id,
    id,
    e.esquemaEditarCliente.parse(req.body),
  );
  res.json(await verCliente(req.tienda!.id, id));
};
export const movimiento: RequestHandler = async (req, res) => {
  const datos = e.esquemaMovimientoFiado.parse(req.body);
  res
    .status(201)
    .json(await registrarFiado(req.tienda!.id, e.esquemaId.parse(req.params.id), datos));
};
