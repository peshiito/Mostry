import { hashearClave, verificarClave } from '../../../shared/crypto/claves.js';
import { enviarSinFallar } from '../../../shared/email/enviarSinFallar.js';
import type { Mailer } from '../../../shared/email/mailer.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { codigoInvalido, credencialesInvalidas } from '../../auth/errores.js';
import { clientesRepo } from './clientes.repository.js';
import { emitirCodigoClub, verificarCodigoClub } from './codigosEmail.service.js';
import { plantillasClub } from './plantillas.js';
import type { DatosRecuperarClub } from './schemas.js';
import { sesionesClubRepo } from './sesionesClub.repository.js';

// Mismo error si no existe o la clave es incorrecta (no revela cuentas).
export async function autenticarCliente(email: string, clave: string) {
  const cliente = await clientesRepo.buscarPorEmail(email);
  const claveOk = await verificarClave(cliente?.hashClave, clave);
  if (!cliente || !claveOk || !cliente.activo) throw credencialesInvalidas();
  if (!cliente.emailVerificadoEn) {
    throw new AppError(403, 'email_sin_verificar', 'Verificá tu email antes de entrar.');
  }
  return cliente.id;
}

// Siempre responde lo mismo; solo manda el código si la cuenta existe.
export async function solicitarRecuperacionCliente(email: string, mailer: Mailer) {
  const cliente = await clientesRepo.buscarPorEmail(email);
  if (cliente?.emailVerificadoEn && cliente.activo)
    await emitirCodigoClub(mailer, cliente, 'recuperar_clave');
}

// Con el código del mail elige una clave nueva: se cierran todas sus sesiones.
export async function confirmarRecuperacionCliente(
  datos: DatosRecuperarClub,
  mailer: Mailer,
) {
  const cliente = await clientesRepo.buscarPorEmail(datos.email);
  if (!cliente) throw codigoInvalido();
  if (!(await verificarCodigoClub(cliente.id, 'recuperar_clave', datos.codigo)))
    throw codigoInvalido();
  await clientesRepo.cambiarClave(cliente.id, await hashearClave(datos.claveNueva));
  await sesionesClubRepo.borrarDeCliente(cliente.id);
  await enviarSinFallar(mailer, {
    para: cliente.email,
    ...plantillasClub.claveCambiada(),
  });
}
