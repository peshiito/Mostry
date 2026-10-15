import type { Ejecutor } from '../../../shared/db/ejecutor.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { exigirCupo } from '../../encargos/cupo.js';
import { checkoutRepo } from '../repositorios/checkout.repository.js';
import type { TiendaParaPedido } from '../repositorios/tiendaParaPedido.repository.js';
import type { DatosCheckout } from '../schemas.js';

// Numera el pedido, lo que bloquea la fila de la tienda: con ese lock, los
// encargos del mismo día pasan de a uno por el cupo (Encargos 2). Tiene que ir
// antes de cualquier lectura común de la transacción (ver cupo.ts).
export async function numerarPedido(
  tx: Ejecutor,
  tiendaId: TiendaId,
  d: DatosCheckout,
  t: TiendaParaPedido,
) {
  const numero = await checkoutRepo.siguienteNumero(tx, tiendaId);
  if (d.tipo === 'encargo')
    await exigirCupo(tx, tiendaId, t.cupoEncargosDia, d.fechaEncargo!);
  return numero;
}
