import { verificarClave } from '../../../shared/crypto/claves.js';
import { db } from '../../../shared/db/db.js';
import { enviarSinFallar } from '../../../shared/email/enviarSinFallar.js';
import type { Mailer } from '../../../shared/email/mailer.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { sinSesion } from '../../auth/errores.js';
import { clientesRepo } from './clientes.repository.js';
import { plantillasClub } from './plantillas.js';
import type { DatosClub } from './schemas.js';

async function clienteDe(id: number) {
  const cliente = await clientesRepo.buscarPorId(id);
  if (!cliente?.activo) throw sinSesion();
  return cliente;
}

// Lo que ve el cliente de su cuenta (nunca el hash ni datos internos).
export async function datosDelCliente(id: number) {
  const { email, nombre, whatsapp, direccion } = await clienteDe(id);
  return { cliente: { email, nombre, whatsapp, direccion } };
}

export async function editarDatosCliente(id: number, datos: DatosClub) {
  await clienteDe(id);
  const direccion =
    datos.direccion === undefined ? {} : { direccion: datos.direccion || null };
  await clientesRepo.actualizar(id, { ...datos, ...direccion });
  return datosDelCliente(id);
}

// Lo que se borra con la cuenta, de hijos a padres.
const TABLAS_DEL_CLIENTE = [
  'canjes',
  'sellos',
  'codigosClub',
  'codigosEmailClub',
  'sesionesClub',
] as const;

// Ley 25.326: el cliente puede borrar su cuenta. Pide la clave (acción sensible).
export async function borrarCuentaCliente(id: number, clave: string, mailer: Mailer) {
  const cliente = await clienteDe(id);
  if (!(await verificarClave(cliente.hashClave, clave))) {
    throw new AppError(403, 'clave_incorrecta', 'La clave no es correcta.');
  }
  // Borrado real: primero lo que cuelga del cliente, después él. Sus compras
  // quedan en las tiendas como compras comunes, sin el vínculo (Lealtad L5).
  await db.transaction().execute(async (tx) => {
    for (const tabla of ['pedidos', 'ventas'] as const)
      await tx
        .updateTable(tabla)
        .set({ clienteId: null })
        .where('clienteId', '=', id)
        .execute();
    for (const tabla of TABLAS_DEL_CLIENTE)
      await tx.deleteFrom(tabla).where('clienteId', '=', id).execute();
    await tx.deleteFrom('clientes').where('id', '=', id).execute();
  });
  await enviarSinFallar(mailer, {
    para: cliente.email,
    ...plantillasClub.cuentaBorrada(),
  });
}
