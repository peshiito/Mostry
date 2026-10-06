import type { RequestHandler } from 'express';
import { zonaDelOrigen } from '../../../shared/utils/origen.js';
import { esquemaLogin } from '../schemas.js';
import { autenticar } from '../servicios/login.service.js';
import { cerrarSesion, crearSesion } from '../servicios/sesiones.service.js';

// Email + contraseña → sesión del panel (o del admin, según la zona).
const login: RequestHandler = async (req, res) => {
  const { email, clave } = esquemaLogin.parse(req.body);
  const resultado = await autenticar(email, clave, zonaDelOrigen(req.get('origin')));
  await crearSesion(req, res, resultado);
  res.json({ mensaje: '¡Bienvenido!' });
};

const logout: RequestHandler = async (req, res) => {
  await cerrarSesion(res, req.sesion!);
  res.status(204).end();
};

export const loginController = { login, logout };
