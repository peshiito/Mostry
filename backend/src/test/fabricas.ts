import { randomBytes } from 'node:crypto';
import { db } from '../shared/db/db.js';
import { idInsertado } from '../shared/db/idInsertado.js';
import { comoTiendaId, type TiendaId } from '../shared/db/tiendaId.js';

// Datos mínimos válidos para tests de base de datos.
export async function crearTienda(slug: string): Promise<TiendaId> {
  const r = await db
    .insertInto('tiendas')
    .values({ slug, nombre: slug })
    .executeTakeFirstOrThrow();
  return comoTiendaId(idInsertado(r));
}

export async function crearProducto(tiendaId: TiendaId, stock = 10): Promise<number> {
  const r = await db
    .insertInto('productos')
    .values({ tiendaId, nombre: 'Medialuna', precio: 35000, stock })
    .executeTakeFirstOrThrow();
  return idInsertado(r);
}

export async function crearPedido(tiendaId: TiendaId, numero = 1): Promise<number> {
  const r = await db
    .insertInto('pedidos')
    .values({
      tiendaId,
      numero,
      tokenSeguimiento: randomBytes(32).toString('base64url'),
      tipo: 'inmediato',
      estado: 'pendiente_pago',
      venceComprobanteEn: new Date(Date.now() + 2 * 60 * 60 * 1000),
      clienteNombre: 'Ana',
      clienteWhatsapp: '5491111111111',
      entrega: 'retiro',
      subtotal: 35000,
      total: 35000,
    })
    .executeTakeFirstOrThrow();
  return idInsertado(r);
}
