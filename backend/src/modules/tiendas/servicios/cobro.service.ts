import { enviarSinFallar } from '../../../shared/email/enviarSinFallar.js';
import type { Mailer } from '../../../shared/email/mailer.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { usuariosRepo } from '../../auth/repositorios/usuarios.repository.js';
import { verificarTotp } from '../../auth/servicios/totp.service.js';
import type { DatosCobro } from '../schemas.js';
import { tiendaConfigRepo } from '../tiendaConfig.repository.js';

const aviso = (alias: string, titular: string) => ({
  asunto: 'Cambió el alias de cobro de tu tienda',
  texto: `El alias donde te pagan tus clientes ahora es "${alias}" (a nombre de ${titular}).\nSi no fuiste vos, entrá ya a tu panel y cambiá tu contraseña.\n\n— El equipo de Mostry`,
});

// Acción sensible: si alguien cambia el alias, la plata va a otra cuenta.
// Por eso pide TOTP y avisa por email a los dueños.
export async function cambiarCobro(
  tiendaId: number,
  usuarioId: number,
  { alias, titularAlias, codigoTotp }: DatosCobro,
  mailer: Mailer,
) {
  const usuario = await usuariosRepo.buscarPorId(usuarioId);
  if (!usuario || !(await verificarTotp(usuario, codigoTotp))) {
    throw new AppError(400, 'codigo_invalido', 'El código de la app no es correcto.');
  }
  await tiendaConfigRepo.actualizar(tiendaId, { alias, titularAlias });
  for (const { email } of await tiendaConfigRepo.emailsDeDuenos(tiendaId)) {
    await enviarSinFallar(mailer, { para: email, ...aviso(alias, titularAlias) });
  }
  return { alias, titularAlias };
}
