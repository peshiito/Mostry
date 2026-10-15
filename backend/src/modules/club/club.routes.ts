import { Router, type RequestHandler } from 'express';
import type { Mailer } from '../../shared/email/mailer.js';
import { datosClubController } from './cuenta/datos.controller.js';
import { exigirSitio, registroClubController } from './cuenta/cuenta.controller.js';
import { ingresoClubController } from './cuenta/ingreso.controller.js';
import { requerirCliente } from './cuenta/requerirCliente.js';
import { crearLimitesClub } from './limites.js';
import { qrDelCliente } from './qr/qr.service.js';
import { historialCliente } from './historial/historialCliente.js';
import { tiendasDelCliente } from './sellos/tiendasDelCliente.js';

const misTiendas: RequestHandler = async (req, res) => {
  res.json(await tiendasDelCliente(req.cliente!.clienteId));
};

const historial: RequestHandler = async (req, res) => {
  res.json(await historialCliente(req.cliente!.clienteId));
};

const verQr: RequestHandler = async (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json(await qrDelCliente(req.cliente!.clienteId));
};

// Club Mostry: la cuenta del cliente (una sola para todas las tiendas) y su QR.
export function rutasClub(mailer: Mailer): Router {
  const r = Router();
  const l = crearLimitesClub();
  const registro = registroClubController(mailer);
  const ingreso = ingresoClubController(mailer);
  const datos = datosClubController(mailer);
  const cliente = requerirCliente();

  r.post('/registro', exigirSitio, l.registro, registro.registro);
  r.post('/verificar-email', exigirSitio, l.codigosIp, registro.verificar);
  r.post('/verificar-email/reenviar', l.codigosIp, l.codigosEmail, registro.reenviar);

  r.post('/login', exigirSitio, l.loginIp, l.loginEmail, ingreso.login);
  r.post('/logout', cliente, ingreso.logout);
  r.post('/recuperar', l.codigosIp, l.codigosEmail, ingreso.recuperar);
  r.post('/recuperar/confirmar', l.codigosIp, l.codigosEmail, ingreso.confirmar);

  r.get('/yo', cliente, datos.yo);
  r.patch('/datos', cliente, datos.editar);
  r.delete('/cuenta', l.claveSensible, cliente, l.claveCliente, datos.borrar);
  r.get('/qr', cliente, l.qr, verQr);
  r.get('/tiendas', cliente, misTiendas);
  r.get('/historial', cliente, historial);
  return r;
}
