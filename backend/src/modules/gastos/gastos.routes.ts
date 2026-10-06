import { Router, type RequestHandler } from 'express';
import { AppError } from '../../shared/errors/AppError.js';
import {
  esquemaEditarProveedor,
  esquemaFiltrosGastos,
  esquemaGasto,
  esquemaId,
  esquemaProveedor,
} from './gastos.schemas.js';
import { listarGastos, registrarGasto } from './gastos.service.js';
import { proveedoresRepo } from './proveedores.repository.js';

const proveedores: RequestHandler = async (req, res) => {
  const { proveedores: cuales } = esquemaFiltrosGastos.parse(req.query);
  res.json(await proveedoresRepo.listar(req.tienda!.id, cuales === 'todos'));
};
const crearProveedor: RequestHandler = async (req, res) => {
  const { nombre, contacto } = esquemaProveedor.parse(req.body);
  const id = await proveedoresRepo.crear(req.tienda!.id, nombre, contacto ?? null);
  res.status(201).json(await proveedoresRepo.buscar(req.tienda!.id, id));
};
// Se edita o se desactiva (activo: false). No se borra.
const editarProveedor: RequestHandler = async (req, res) => {
  const id = esquemaId.parse(req.params.id);
  if (!(await proveedoresRepo.buscar(req.tienda!.id, id)))
    throw new AppError(404, 'proveedor_no_encontrado', 'No encontramos ese proveedor.');
  await proveedoresRepo.actualizar(
    req.tienda!.id,
    id,
    esquemaEditarProveedor.parse(req.body),
  );
  res.json(await proveedoresRepo.buscar(req.tienda!.id, id));
};
const gastos: RequestHandler = async (req, res) => {
  const { desde, hasta, tipo } = esquemaFiltrosGastos.parse(req.query);
  res.json(await listarGastos(req.tienda!.id, desde, hasta, tipo));
};
const crearGasto: RequestHandler = async (req, res) => {
  res
    .status(201)
    .json(await registrarGasto(req.tienda!.id, esquemaGasto.parse(req.body)));
};

// Gastos y proveedores del panel. El acceso lo pone rutasPanel.
export function rutasGastos(): Router {
  const r = Router();
  r.get('/proveedores', proveedores);
  r.post('/proveedores', crearProveedor);
  r.patch('/proveedores/:id', editarProveedor);
  r.get('/gastos', gastos);
  r.post('/gastos', crearGasto);
  return r;
}
