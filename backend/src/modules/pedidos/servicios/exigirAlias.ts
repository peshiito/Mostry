import { AppError } from '../../../shared/errors/AppError.js';
import type { TiendaParaPedido } from '../repositorios/tiendaParaPedido.repository.js';

// Si hay algo para pagar (ahora o al aceptarse), hace falta el alias.
export function exigirAlias(t: TiendaParaPedido, requierePago: boolean) {
  if (requierePago && !t.alias)
    throw new AppError(
      409,
      'tienda_sin_alias',
      'La tienda todavía no cargó dónde recibir pagos.',
    );
}
