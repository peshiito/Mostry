import type { RequestHandler } from 'express';
import { esquemaActivarTotp } from '../schemas.js';
import { activarTotpDe, prepararTotpDe } from '../servicios/activarTotp.service.js';
import { completarSesion } from '../servicios/sesiones.service.js';

// Devuelve la URI otpauth:// (el frontend la muestra como QR) y el secreto
// en texto por si la persona prefiere cargarlo a mano.
const preparar: RequestHandler = async (req, res) => {
  res.json(await prepararTotpDe(req.sesion!.usuarioId));
};

// Los códigos de recuperación se muestran esta única vez.
const activar: RequestHandler = async (req, res) => {
  const { codigoTotp } = esquemaActivarTotp.parse(req.body);
  const codigosRecuperacion = await activarTotpDe(req.sesion!.usuarioId, codigoTotp);
  await completarSesion(req, res, req.sesion!);
  res.json({ codigosRecuperacion });
};

export const totpController = { preparar, activar };
