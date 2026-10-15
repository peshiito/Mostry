import { randomUUID } from 'node:crypto';
import { borrarConCola } from '../../../shared/archivos/borrarConCola.js';
import { prefijoTienda } from '../../../shared/archivos/claves.js';
import { subirPrivado } from '../../../shared/archivos/privado.js';
import { aWebp } from '../../../shared/archivos/procesarImagen.js';
import { validarImagen } from '../../../shared/archivos/validarImagen.js';
import { db } from '../../../shared/db/db.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { AppError } from '../../../shared/errors/AppError.js';
import type { Pedido } from '../../pedidos/repositorios/pedidos.repository.js';
import { pedidosRepo } from '../../pedidos/repositorios/pedidos.repository.js';
import { itemDelPedido, itemNoEncontrado } from './itemDelPedido.js';

const LADO = 1600;
// Máximo aunque nadie cierre el pedido: más que los 60 días a los que se puede encargar.
const RETENCION_MS = 90 * 24 * 60 * 60 * 1000;

// La foto se elige mientras la tienda decide; después ya no se cambia.
function exigirPorAceptar(p: Pedido | undefined) {
  if (p?.tipo !== 'encargo' || p.estado !== 'pendiente_confirmacion')
    throw new AppError(
      409,
      'foto_fuera_de_tiempo',
      'La foto se puede sumar solo mientras la tienda no aceptó el encargo.',
    );
}

// Encargos 2: el comprador suma una foto de referencia a un ítem personalizado.
// Por contenido, nunca por extensión; se reprocesa a WebP y va al bucket PRIVADO.
export async function subirFotoReferencia(
  tiendaId: TiendaId,
  token: string,
  itemId: number,
  archivo: Buffer,
) {
  const pedido = await pedidosRepo.porToken(tiendaId, token);
  if (!pedido)
    throw new AppError(404, 'pedido_no_encontrado', 'No encontramos ese pedido.');
  const item = await itemDelPedido(tiendaId, pedido.id, itemId);
  if (!item) throw itemNoEncontrado();
  exigirPorAceptar(pedido);
  if (!item.personalizacion)
    throw new AppError(409, 'item_sin_personalizacion', 'Ese producto no lleva foto.');
  await validarImagen(archivo);
  const [datos] = await aWebp(archivo, [LADO]);
  const clave = `${prefijoTienda(tiendaId)}encargos/${pedido.id}/${randomUUID()}.webp`;
  await subirPrivado(clave, datos!, 'image/webp');

  let anterior: string | null = null;
  try {
    await db.transaction().execute(async (tx) => {
      exigirPorAceptar(await pedidosRepo.bloquear(tx, tiendaId, pedido.id));
      anterior =
        (await itemDelPedido(tiendaId, pedido.id, itemId, tx))?.fotoClave ?? null;
      await tx
        .updateTable('pedidoItems')
        .set({ fotoClave: clave, fotoBorrarEn: new Date(Date.now() + RETENCION_MS) })
        .where('tiendaId', '=', tiendaId)
        .where('id', '=', itemId)
        .execute();
    });
  } catch (err) {
    await borrarConCola([clave], 'privado');
    throw err;
  }
  if (anterior) await borrarConCola([anterior], 'privado'); // la reemplazó
  return { tieneFoto: true };
}
