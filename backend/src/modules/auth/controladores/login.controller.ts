import type { RequestHandler } from 'express';
import { zonaDelOrigen } from '../../../shared/utils/origen.js';
import { esquemaLogin, esquemaSegundoFactor } from '../schemas.js';
import { verificarSegundoFactorDe } from '../servicios/activarTotp.service.js';
import { autenticar } from '../servicios/login.service.js';
import {
  cerrarSesion,
  completarSesion,
  crearSesion,
} from '../servicios/sesiones.service.js';

// Paso 1: email + clave → sesión parcial de 10 min (todavía no sirve para nada).
const login: RequestHandler = async (req, res) => {
  const { email, clave } = esquemaLogin.parse(req.body);
  const resultado = await autenticar(email, clave, zonaDelOrigen(req.get('origin')));
  await crearSesion(req, res, resultado);
  const siguientePaso = resultado.estado === 'falta_totp' ? 'totp' : 'configurar_totp';
  res.json({ siguientePaso });
};

// Paso 2: código de la app (o de recuperación) → sesión completa.
const loginTotp: RequestHandler = async (req, res) => {
  const sesion = req.sesion!;
  await verificarSegundoFactorDe(sesion.usuarioId, esquemaSegundoFactor.parse(req.body));
  await completarSesion(req, res, sesion);
  res.json({ mensaje: '¡Bienvenido!' });
};

const logout: RequestHandler = async (req, res) => {
  await cerrarSesion(res, req.sesion!);
  res.status(204).end();
};

export const loginController = { login, loginTotp, logout };
