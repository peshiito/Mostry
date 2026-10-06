import type { Ejecutor } from '../../../shared/db/ejecutor.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { checkoutRepo } from '../repositorios/checkout.repository.js';

// Reserva cada producto o corta con 409: la transacción deshace las reservas anteriores.
export async function reservarItems(
  tx: Ejecutor,
  tiendaId: TiendaId,
  items: { productoId: number; nombre: string; cantidad: number }[],
) {
  // Siempre en el mismo orden (por producto): dos compras simultáneas con los
  // mismos productos en distinto orden no se bloquean entre sí (deadlock).
  for (const i of [...items].sort((a, b) => a.productoId - b.productoId)) {
    if (!(await checkoutRepo.reservar(tx, tiendaId, i.productoId, i.cantidad))) {
      throw new AppError(409, 'sin_stock', `No hay suficiente "${i.nombre}".`, {
        productoId: i.productoId,
      });
    }
  }
}
