import { hashearClave } from '../../../shared/crypto/claves.js';
import { db } from '../../../shared/db/db.js';
import { esDuplicado } from '../../../shared/db/esDuplicado.js';
import { enviarSinFallar } from '../../../shared/email/enviarSinFallar.js';
import type { Mailer } from '../../../shared/email/mailer.js';
import { miembrosRepo } from '../../tiendas/miembros.repository.js';
import { tiendasRepo } from '../../tiendas/tiendas.repository.js';
import { plantillas } from '../emails/plantillas.js';
import { slugOcupado } from '../errores.js';
import { usuariosRepo } from '../repositorios/usuarios.repository.js';
import type { DatosRegistro } from '../schemas.js';
import { emitirCodigo } from './codigosEmail.service.js';

// Crea usuario + tienda + membresía y manda el código de verificación.
// Si el email ya existe, responde igual y avisa por email (no revela cuentas).
export async function registrar(datos: DatosRegistro, mailer: Mailer): Promise<void> {
  if (await tiendasRepo.buscarPorSlug(datos.slug)) throw slugOcupado();
  // Se hashea siempre, antes de decidir: así tarda lo mismo exista o no el email.
  const hashClave = await hashearClave(datos.clave);
  const yaTenesCuenta = () =>
    enviarSinFallar(mailer, { para: datos.email, ...plantillas.yaTenesCuenta() });

  if (await usuariosRepo.buscarPorEmail(datos.email)) return yaTenesCuenta();

  let usuarioId: number;
  try {
    usuarioId = await db.transaction().execute(async (tx) => {
      const id = await usuariosRepo.crear(
        { email: datos.email, hashClave, nombre: datos.nombre },
        tx,
      );
      const tiendaId = await tiendasRepo.crear(
        { slug: datos.slug, nombre: datos.nombreNegocio },
        tx,
      );
      await miembrosRepo.crear(tiendaId, id, tx);
      return id;
    });
  } catch (err) {
    // Carrera: otro registro ganó el mismo slug o email entre el chequeo y el INSERT.
    if (esDuplicado(err, 'uq_tiendas_slug')) throw slugOcupado();
    if (esDuplicado(err, 'uq_usuarios_email')) return yaTenesCuenta();
    throw err;
  }
  await emitirCodigo(mailer, { id: usuarioId, email: datos.email }, 'verificar_email');
}
