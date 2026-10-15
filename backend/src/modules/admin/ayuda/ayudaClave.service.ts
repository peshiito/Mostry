import { hashearClave } from '../../../shared/crypto/claves.js';
import { db } from '../../../shared/db/db.js';
import type { Mailer } from '../../../shared/email/mailer.js';
import { sesionesRepo } from '../../auth/repositorios/sesiones.repository.js';
import { emitirCodigo } from '../../auth/servicios/codigosEmail.service.js';
import { claveLegible } from './claveLegible.js';
import { anotar, tiendaYDueno } from './contexto.js';

// Clave temporal: el admin se la manda por WhatsApp y, al entrar, el dueño tiene
// que elegir una nueva. Se devuelve UNA vez; no se guarda ni se loguea en claro.
export async function claveTemporal(id: number, adminId: number) {
  const { tienda, dueno } = await tiendaYDueno(id);
  const clave = claveLegible();
  await db
    .updateTable('usuarios')
    .set({ hashClave: await hashearClave(clave), debeCambiarClave: true })
    .where('id', '=', dueno.id)
    .execute();
  await sesionesRepo.borrarDeUsuario(dueno.id);
  await anotar(adminId, tienda, 'clave_temporal');
  return { clave, email: dueno.email };
}

// Reenvía el mail que le sirve: si nunca verificó el email, el código de
// verificación; si no, el de recuperar la contraseña.
export async function reenviarMail(id: number, adminId: number, mailer: Mailer) {
  const { tienda, dueno } = await tiendaYDueno(id);
  const proposito = dueno.emailVerificadoEn ? 'recuperar_clave' : 'verificar_email';
  await emitirCodigo(mailer, dueno, proposito);
  await anotar(adminId, tienda, 'reenviar_mail', proposito);
  return { email: dueno.email, proposito };
}
