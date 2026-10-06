import { tokenAleatorio } from '../../../shared/crypto/tokens.js';
import { db } from '../../../shared/db/db.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { cargarAgenda } from '../../horarios/repositorios/agenda.repository.js';
import { checkoutRepo as repo } from '../repositorios/checkout.repository.js';
import { tiendaParaPedido } from '../repositorios/tiendaParaPedido.repository.js';
import type { DatosCheckout } from '../schemas.js';
import { armarItems } from './armarPedido.js';
import { filaPedido } from './filaPedido.js';
import { reservarItems } from './reservarItems.js';
import { validarReglasCheckout } from './reglasCheckout.js';
import { calcularTotales } from './totales.js';
import { respuestaCheckout } from './respuestaCheckout.js';

// Crea el pedido (CLAUDE.md 6.1 y 6.2). Todo en una transacción: si algo falla,
// se deshacen también las reservas de stock.
export async function crearPedido(
  tiendaId: TiendaId,
  d: DatosCheckout,
  ahora = new Date(),
) {
  const t = await tiendaParaPedido(tiendaId);
  validarReglasCheckout(t, await cargarAgenda(tiendaId, ahora), d, ahora);

  const pedido = await db.transaction().execute(async (tx) => {
    const productos = await repo.productos(
      tx,
      tiendaId,
      d.items.map((i) => i.productoId),
    );
    const items = armarItems(d.tipo, d.items, productos);
    const totales = calcularTotales(d, items, t);
    if (totales.requierePago && !t.alias) {
      throw new AppError(
        409,
        'tienda_sin_alias',
        'La tienda todavía no cargó dónde recibir pagos.',
      );
    }
    // Orden fijo de locks: primero la tienda (número), después los productos.
    const numero = await repo.siguienteNumero(tx, tiendaId);
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
    const fila = filaPedido(tiendaId, d, totales, extra);
    await repo.insertar(
      tx,
      fila,
      items.map((i) => ({ ...i, tiendaId })),
    );
    return fila;
  });

  return respuestaCheckout(t, pedido);
}
