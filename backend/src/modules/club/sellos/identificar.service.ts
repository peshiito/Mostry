import { z } from 'zod';
import { db } from '../../../shared/db/db.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { programaRepo } from '../programa/programa.repository.js';
import { clienteDelCodigo } from '../qr/qr.service.js';
import { firmarFicha, leerFicha } from './fichaClub.js';
import { programaVigente } from './programaVigente.js';
import { saldoDe } from './saldo.js';

// El código del QR (6 caracteres, sin 0/O ni 1/I/L). Se acepta en minúscula.
export const esquemaCodigo = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{6}$/);

const codigoInvalido = () =>
  new AppError(404, 'codigo_invalido', 'Ese código no es válido o ya venció.');

// Quién es el cliente de un código, para ESTA tienda: el club tiene que estar
// prendido. Devuelve el id (para uso interno del servidor) y su saldo.
export async function clienteDeLaTienda(tiendaId: TiendaId, codigo: string) {
  const programa = await programaVigente(tiendaId);
  if (!programa)
    throw new AppError(409, 'club_apagado', 'Prendé tu club de clientes primero.');
  const clienteId = await clienteDelCodigo(codigo);
  if (!clienteId) throw codigoInvalido();
  const sellos = await saldoDe(tiendaId, clienteId, programa.venceMeses);
  return { clienteId, sellos, programa };
}

// La venta del local trae la ficha que firmó identificar (no el código del QR,
// que pudo rotar mientras cargaban los productos).
export async function clienteDeFicha(tiendaId: TiendaId, ficha: string) {
  if (!(await programaVigente(tiendaId)))
    throw new AppError(409, 'club_apagado', 'Prendé tu club de clientes primero.');
  const clienteId = leerFicha(tiendaId, ficha);
  if (!clienteId)
    throw new AppError(404, 'ficha_vencida', 'Volvé a identificar al cliente del club.');
  return clienteId;
}

// Lo que ve el comercio al escanear: el nombre, sus sellos en ESTA tienda y
// qué premios ya puede usar. Nunca lo que compró en otras tiendas.
export async function identificarCliente(tiendaId: TiendaId, codigo: string) {
  const { clienteId, sellos, programa } = await clienteDeLaTienda(tiendaId, codigo);
  const [cliente, premios] = await Promise.all([
    db
      .selectFrom('clientes')
      .select('nombre')
      .where('id', '=', clienteId)
      .executeTakeFirstOrThrow(),
    programaRepo.premios(tiendaId),
  ]);
  return {
    ficha: firmarFicha(tiendaId, clienteId),
    nombre: cliente.nombre,
    sellos,
    compraMinima: programa.compraMinima,
    premios: premios.map((p) => ({ ...p, disponible: sellos >= p.compras })),
  };
}
