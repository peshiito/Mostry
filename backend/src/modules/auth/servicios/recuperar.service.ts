import { hashearClave } from '../../../shared/crypto/claves.js';
import { enviarSinFallar } from '../../../shared/email/enviarSinFallar.js';
import type { Mailer } from '../../../shared/email/mailer.js';
import { plantillas } from '../emails/plantillas.js';
import { codigoInvalido } from '../errores.js';
import { sesionesRepo } from '../repositorios/sesiones.repository.js';
import { usuariosRepo } from '../repositorios/usuarios.repository.js';
import type { DatosRecuperar } from '../schemas.js';
import { emitirCodigo, verificarCodigo } from './codigosEmail.service.js';

// Siempre responde lo mismo; solo manda el código si la cuenta existe.
export async function solicitarRecuperacion(
  email: string,
  mailer: Mailer,
): Promise<void> {
  const usuario = await usuariosRepo.buscarPorEmail(email);
  if (usuario?.emailVerificadoEn && usuario.activo) {
    await emitirCodigo(mailer, usuario, 'recuperar_clave');
  }
}

// Con el código que le llegó por email elige una contraseña nueva.
// Se cierran todas sus sesiones y se le avisa del cambio.
export async function confirmarRecuperacion(datos: DatosRecuperar, mailer: Mailer) {
  const usuario = await usuariosRepo.buscarPorEmail(datos.email);
  if (!usuario) throw codigoInvalido();
  if (!(await verificarCodigo(usuario.id, 'recuperar_clave', datos.codigo))) {
    throw codigoInvalido();
  }
  await usuariosRepo.cambiarClave(usuario.id, await hashearClave(datos.claveNueva));
  await sesionesRepo.borrarDeUsuario(usuario.id);
  await enviarSinFallar(mailer, { para: usuario.email, ...plantillas.claveCambiada() });
}
