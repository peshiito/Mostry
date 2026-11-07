import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { paginaPublicada } from '../../tiendas/pagina/paginaPublicada.js';

// "Armá tu página" (P4): si la tienda apagó el carrito, los pedidos van por
// WhatsApp y la API no acepta un checkout (aunque alguien arme la llamada a mano).
export async function exigirCarrito(tiendaId: TiendaId) {
  const pagina = await paginaPublicada(tiendaId);
  if (pagina?.ajustes.carrito === false)
    throw new AppError(409, 'sin_carrito', 'Esta tienda toma los pedidos por WhatsApp.');
}
