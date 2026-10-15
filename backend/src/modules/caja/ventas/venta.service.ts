import { db } from '../../../shared/db/db.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { clienteDeFicha } from '../../club/sellos/identificar.service.js';
import { registrarMovimiento } from '../servicios/registrarMovimiento.js';
import { bloquearPrograma } from '../../club/canjes/prepararCanje.js';
import { cerrarClubDeVenta, premioDeVenta } from './clubDeVenta.js';
import { armarVenta } from './armarVenta.js';
import { siguienteNumeroVenta } from './numeroVenta.js';
import type { DatosVenta } from './schemas.js';
import { ventasRepo } from './ventas.repository.js';

// Cobra una venta del local (Mejoras 3, parte C). Todo o nada: precios del
// servidor, stock (solo lo que cuenta unidades), la venta y su ingreso en caja.
// En efectivo exige la caja de hoy abierta (registrarMovimiento, regla 6.4).
export async function crearVenta(tiendaId: TiendaId, d: DatosVenta) {
  // Club: la ficha la firmó el servidor al identificar (nunca un id suelto).
  const clienteId = d.fichaClub ? await clienteDeFicha(tiendaId, d.fichaClub) : null;
  return db.transaction().execute(async (tx) => {
    if (d.premio !== undefined) await bloquearPrograma(tx, tiendaId); // primero
    const ids = d.items.map((i) => i.productoId);
    const productos = ids.length ? await ventasRepo.productos(tx, tiendaId, ids) : [];
    const { items, total: bruto } = armarVenta(d, productos);
    // Premio del Club (el programa ya está bloqueado arriba).
    const canje = await premioDeVenta(tx, tiendaId, clienteId, d.premio, bruto);
    const descuento = canje?.descuento ?? 0;
    const total = bruto - descuento;
    // Después la tienda (número) y los productos ordenados por id, como el checkout.
    const numero = await siguienteNumeroVenta(tx, tiendaId);
    for (const i of [...d.items].sort((a, b) => a.productoId - b.productoId)) {
      const p = productos.find((x) => x.id === i.productoId)!;
      if (p.modoStock !== 'unidades') continue;
      if (!(await ventasRepo.descontar(tx, tiendaId, p.id, i.cantidad))) {
        const quedan = Math.max(p.stock - p.stockReservado, 0);
        throw new AppError(409, 'sin_stock', `De "${p.nombre}" te quedan ${quedan}.`, {
          productoId: p.id,
        });
      }
    }
    const ventaId = await ventasRepo.insertar(
      tx,
      { tiendaId, numero, total, descuento, medio: d.medio, clienteId },
      items,
    );
    // Gratis con un premio: no entra plata a la caja.
    if (total > 0)
      await registrarMovimiento(tx, tiendaId, {
        tipo: 'ingreso',
        medio: d.medio,
        monto: total,
        concepto: `Venta en el local #${numero}`,
        origen: 'venta',
        origenId: ventaId,
      });
    const sello = await cerrarClubDeVenta(tx, tiendaId, clienteId, canje, {
      id: ventaId,
      cobrado: total,
    });
    return { id: ventaId, numero, total, descuento, medio: d.medio, items, sello };
  });
}
