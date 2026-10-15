import type { RequestHandler } from 'express';
import type { Mailer } from '../../../shared/email/mailer.js';
import {
  borrarCuentaCliente,
  datosDelCliente,
  editarDatosCliente,
} from './datos.service.js';
import { esquemaBorrarClub, esquemaDatosClub } from './schemas.js';
import { borrarCookieClub } from './sesionClub.js';

export function datosClubController(mailer: Mailer) {
  const yo: RequestHandler = async (req, res) => {
    res.json(await datosDelCliente(req.cliente!.clienteId));
  };

  const editar: RequestHandler = async (req, res) => {
    const datos = esquemaDatosClub.parse(req.body);
    res.json(await editarDatosCliente(req.cliente!.clienteId, datos));
  };

  const borrar: RequestHandler = async (req, res) => {
    const { clave } = esquemaBorrarClub.parse(req.body);
    await borrarCuentaCliente(req.cliente!.clienteId, clave, mailer);
    borrarCookieClub(res);
    res.status(204).end();
  };

  return { yo, editar, borrar };
}
