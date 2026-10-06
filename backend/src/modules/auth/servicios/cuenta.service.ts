import { hashearClave, verificarClave } from '../../../shared/crypto/claves.js';
import { enviarSinFallar } from '../../../shared/email/enviarSinFallar.js';
import type { Mailer } from '../../../shared/email/mailer.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { miembrosRepo } from '../../tiendas/miembros.repository.js';
import { plantillas } from '../emails/plantillas.js';
import { sinSesion } from '../errores.js';
import { sesionesRepo, type SesionVigente } from '../repositorios/sesiones.repository.js';
import { usuariosRepo } from '../repositorios/usuarios.repository.js';
import type { DatosCambiarClave } from '../schemas.js';

export async function datosDeCuenta(usuarioId: number) {
  const usuario = await usuariosRepo.buscarPorId(usuarioId);
  if (!usuario) throw sinSesion();
  const { id, email, nombre, esAdmin } = usuario;
  return {
    usuario: { id, email, nombre, esAdmin },
    tiendas: await miembrosRepo.tiendasDeUsuario(id),
  };
}

// Acción sensible: pide la contraseña actual.
export async function cambiarClave(
  sesion: SesionVigente,
  datos: DatosCambiarClave,
  mailer: Mailer,
) {
  const usuario = await usuariosRepo.buscarPorId(sesion.usuarioId);
  if (!usuario) throw sinSesion();
  const claveOk = await verificarClave(usuario.hashClave, datos.claveActual);
  if (!claveOk) {
    throw new AppError(400, 'clave_incorrecta', 'La contraseña actual no es correcta.');
  }
  await usuariosRepo.cambiarClave(usuario.id, await hashearClave(datos.claveNueva));
  await sesionesRepo.borrarDeUsuario(usuario.id, sesion.id);
  await enviarSinFallar(mailer, { para: usuario.email, ...plantillas.claveCambiada() });
}
