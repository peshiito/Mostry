import { db } from '../../../shared/db/db.js';
import { esDuplicado } from '../../../shared/db/esDuplicado.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { slugOcupado } from '../../auth/errores.js';
import { sesionesRepo } from '../../auth/repositorios/sesiones.repository.js';
import { usuariosRepo } from '../../auth/repositorios/usuarios.repository.js';
import { tiendasRepo } from '../../tiendas/tiendas.repository.js';
import { anotar, tiendaYDueno } from './contexto.js';
import type { DatosDueno, DatosTiendaAdmin } from './schemas.js';

const emailEnUso = () =>
  new AppError(409, 'email_en_uso', 'Ese email ya es de otra cuenta.');

// Corrige el email o el nombre del dueño. El email nuevo queda verificado (lo
// confirmó el admin hablando con él) y se cierran sus sesiones abiertas.
export async function cambiarDueno(id: number, adminId: number, datos: DatosDueno) {
  const { tienda, dueno } = await tiendaYDueno(id);
  const cambiaEmail = datos.email !== undefined && datos.email !== dueno.email;
  if (cambiaEmail && (await usuariosRepo.buscarPorEmail(datos.email!)))
    throw emailEnUso();
  try {
    await db
      .updateTable('usuarios')
      .set({ ...datos, ...(cambiaEmail ? { emailVerificadoEn: new Date() } : {}) })
      .where('id', '=', dueno.id)
      .execute();
  } catch (err) {
    if (esDuplicado(err, 'uq_usuarios_email')) throw emailEnUso();
    throw err;
  }
  if (cambiaEmail) await sesionesRepo.borrarDeUsuario(dueno.id);
  await anotar(adminId, tienda, 'cambiar_dueno', Object.keys(datos).join(', '));
  return { email: datos.email ?? dueno.email, nombre: datos.nombre ?? dueno.nombre };
}

// Corrige nombre, link o WhatsApp de la tienda (por ejemplo, un link mal escrito
// al registrarse). El link viejo deja de andar: el admin lo avisa antes.
export async function corregirTienda(
  id: number,
  adminId: number,
  datos: DatosTiendaAdmin,
) {
  const { tienda } = await tiendaYDueno(id);
  if (
    datos.slug &&
    datos.slug !== tienda.slug &&
    (await tiendasRepo.buscarPorSlug(datos.slug))
  )
    throw slugOcupado();
  try {
    await db.updateTable('tiendas').set(datos).where('id', '=', tienda.id).execute();
  } catch (err) {
    if (esDuplicado(err, 'uq_tiendas_slug')) throw slugOcupado();
    throw err;
  }
  await anotar(adminId, tienda, 'corregir_tienda', Object.keys(datos).join(', '));
  return { ...tienda, ...datos };
}
