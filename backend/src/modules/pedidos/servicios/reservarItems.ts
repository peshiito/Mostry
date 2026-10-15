import type { Ejecutor } from '../../../shared/db/ejecutor.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { checkoutRepo } from '../repositorios/checkout.repository.js';

// Reserva cada producto o corta con 409: la transacción deshace las reservas anteriores.
export async function reservarItems(
  tx: Ejecutor,
  tiendaId: TiendaId,
  items: { productoId: number; nombre: string; cantidad: number; reservo: boolean }[],
) {
  // Siempre en el mismo orden (por producto): dos compras simultáneas con los
  // mismos productos en distinto orden no se bloquean entre sí (deadlock).
  // Los de "hay / no hay" no reservan: armarItems ya verificó que no estén agotados.
  const aReservar = items.filter((i) => i.reservo);
  for (const i of [...aReservar].sort((a, b) => a.productoId - b.productoId)) {
    if (!(await checkoutRepo.reservar(tx, tiendaId, i.productoId, i.cantidad))) {
      throw new AppError(409, 'sin_stock', `No hay suficiente "${i.nombre}".`, {
        productoId: i.productoId,
      });
    }
  }
}
