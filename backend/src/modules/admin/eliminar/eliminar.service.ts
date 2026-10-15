import { encolarBorrado } from '../../../shared/archivos/colaBorrado.js';
import { verificarClave } from '../../../shared/crypto/claves.js';
import { db } from '../../../shared/db/db.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { usuariosRepo } from '../../auth/repositorios/usuarios.repository.js';
import { anotar, tiendaYDueno } from '../ayuda/contexto.js';
import type { DatosEliminar } from '../ayuda/schemas.js';
import { archivosDeTienda } from './archivosDeTienda.js';
import { borrarTiendaEnTx } from '../../tiendas/borrado/borrarTienda.js';
import { guardarResumen } from './resumen.js';

// Solo se elimina lo que no está en uso: una tienda suspendida, o un registro
// que nunca verificó su email (quedó a medias y no tiene nada adentro).
async function controlar(id: number, adminId: number, datos: DatosEliminar) {
  const ctx = await tiendaYDueno(id);
  if (ctx.tienda.estado !== 'suspendida' && ctx.dueno.emailVerificadoEn) {
    throw new AppError(409, 'tienda_en_uso', 'Solo se eliminan tiendas suspendidas.');
  }
  const admin = await usuariosRepo.buscarPorId(adminId);
  const claveOk = await verificarClave(admin?.hashClave, datos.claveAdmin);
  if (datos.slugConfirmado !== ctx.tienda.slug || !claveOk) {
    throw new AppError(
      403,
      'confirmacion_invalida',
      'El link o tu contraseña no coinciden.',
    );
  }
  return ctx;
}

// Elimina la tienda con todo (Mejoras 4). Todo o nada, en una transacción;
// los archivos se encolan al final para que el worker los borre del bucket.
export async function eliminarTienda(id: number, adminId: number, datos: DatosEliminar) {
  const { tiendaId, tienda, dueno } = await controlar(id, adminId, datos);
  const archivos = await db.transaction().execute(async (tx) => {
    const claves = await archivosDeTienda(tx, tiendaId);
    await guardarResumen(tx, { ...tienda, id: tiendaId });
    await borrarTiendaEnTx(tx, tiendaId, dueno.id);
    return claves;
  });
  await encolarBorrado(archivos.publico, 'publico');
  await encolarBorrado(archivos.privado, 'privado');
  await anotar(adminId, tienda, 'eliminar_tienda');
  return { eliminada: tienda.slug };
}
