import type { TiendaId } from '../../shared/db/tiendaId.js';
import { AppError } from '../../shared/errors/AppError.js';
import { clientesRepo } from './clientes.repository.js';

export const clienteNoEncontrado = () =>
  new AppError(404, 'cliente_no_encontrado', 'No encontramos ese cliente.');

export async function verCliente(tiendaId: TiendaId, id: number) {
  const cliente = await clientesRepo.buscar(tiendaId, id);
  if (!cliente) throw clienteNoEncontrado();
  return {
    ...cliente,
    saldo: Number(cliente.saldo),
    movimientos: await clientesRepo.movimientos(tiendaId, id),
  };
}
