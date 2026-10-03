import { AppError } from '../../shared/errors/AppError.js';

// Mensajes genéricos a propósito: no revelan qué dato falló ni si el email existe.
export const credencialesInvalidas = () =>
  new AppError(401, 'credenciales_invalidas', 'Email o contraseña incorrectos.');

export const codigoInvalido = () =>
  new AppError(400, 'codigo_invalido', 'El código no es válido o ya venció.');

export const sinSesion = () =>
  new AppError(401, 'sin_sesion', 'Iniciá sesión para continuar.');

export const slugOcupado = () =>
  new AppError(
    409,
    'slug_ocupado',
    'Ese nombre de tienda ya está en uso. Probá con otro.',
  );
