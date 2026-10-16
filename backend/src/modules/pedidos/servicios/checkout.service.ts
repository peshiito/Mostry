import { tokenAleatorio } from '../../../shared/crypto/tokens.js';
import { db } from '../../../shared/db/db.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { cargarAgenda } from '../../horarios/repositorios/agenda.repository.js';
import { checkoutRepo as repo } from '../repositorios/checkout.repository.js';
import { tiendaParaPedido } from '../repositorios/tiendaParaPedido.repository.js';
import type { DatosCheckout } from '../schemas.js';
import { registrarCanje } from '../../club/canjes/registrarCanje.js';
import { avisoDePedido, encolarAviso } from '../../avisos/encolar.js';
import { bloquearSiHayPremio, canjeDelPedido } from './canjeDelPedido.js';
import { armarItems } from './armarPedido.js';
import { filaPedido } from './filaPedido.js';
import { reservarItems } from './reservarItems.js';
import { validarReglasCheckout } from './reglasCheckout.js';
import { exigirAlias } from './exigirAlias.js';
import { numerarPedido } from './numerarPedido.js';
import { conAnticipacion } from '../../encargos/anticipacion.js';
import { calcularTotales } from './totales.js';
import { respuestaCheckout } from './respuestaCheckout.js';

// Crea el pedido (CLAUDE.md 6.1 y 6.2). Todo en una transacción: si algo falla,
// se deshacen también las reservas de stock.
export async function crearPedido(
  tiendaId: TiendaId,
  d: DatosCheckout,
  ahora = new Date(),
  clienteId: number | null = null, // cliente del Club, si entró (Lealtad L3)
) {
  // Un encargo usa la mayor anticipación entre la tienda y sus productos.
  const t = await conAnticipacion(await tiendaParaPedido(tiendaId), tiendaId, d);
  validarReglasCheckout(t, await cargarAgenda(tiendaId, ahora), d, ahora);
  const pedido = await db.transaction().execute(async (tx) => {
    await bloquearSiHayPremio(tx, tiendaId, d); // antes de leer nada (prepararCanje.ts)
    // Locks: premio, tienda (número), productos. Antes de toda lectura común:
    // así el cupo de encargos cuenta lo último (ver encargos/cupo.ts).
    const numero = await numerarPedido(tx, tiendaId, d, t);
    const productos = await repo.productos(
      tx,
      tiendaId,
      d.items.map((i) => i.productoId),
    );
    const items = armarItems(d.tipo, d.items, productos);
    const canje = await canjeDelPedido(tx, tiendaId, d, clienteId, items);
    const totales = calcularTotales(d, items, t, canje?.descuento);
    exigirAlias(t, totales.requierePago);
    // Los encargos no tocan el stock (se fabrican a pedido, sección 6.2).
    if (d.tipo === 'inmediato') await reservarItems(tx, tiendaId, items);
    const plazoHoras =
      d.tipo === 'inmediato' ? t.plazoComprobanteHoras : t.plazoSenaHoras;
    const extra = {
      numero,
      token: tokenAleatorio(),
      plazoHoras,
      ahora,
    };
    const fila = { ...filaPedido(tiendaId, d, totales, extra), clienteId };
    const pedidoId = await repo.insertar(
      tx,
      fila,
      items.map((i) => ({ ...i, tiendaId })),
    );
    if (canje) await registrarCanje(tx, tiendaId, canje, 'pedido', pedidoId);
    await encolarAviso(tx, tiendaId, avisoDePedido(d.tipo, pedidoId)); // Avisos 1
    return fila;
  });

  return respuestaCheckout(t, pedido);
}
