import type { Ejecutor } from '../../../shared/db/ejecutor.js';
import { db } from '../../../shared/db/db.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';

// Toda función exige tiendaId (sección 4.1).
export const pedidosRepo = {
  buscar: (tiendaId: TiendaId, id: number, ej: Ejecutor = db) =>
    ej
      .selectFrom('pedidos')
      .selectAll()
      .where('tiendaId', '=', tiendaId)
      .where('id', '=', id)
      .executeTakeFirst(),

  // Bloquea el pedido: dos cambios de estado a la vez se ponen en fila.
  bloquear: (tx: Ejecutor, tiendaId: TiendaId, id: number) =>
    tx
      .selectFrom('pedidos')
      .selectAll()
      .where('tiendaId', '=', tiendaId)
      .where('id', '=', id)
      .forUpdate()
      .executeTakeFirst(),

  // El token solo sirve dentro de SU tienda: con el de otra, 404.
  porToken: (tiendaId: TiendaId, token: string) =>
    db
      .selectFrom('pedidos')
      .selectAll()
      .where('tiendaId', '=', tiendaId)
      .where('tokenSeguimiento', '=', token)
      .executeTakeFirst(),

  // La clave de la foto no sale nunca: solo si hay foto (se ve con URL firmada).
  items: async (tiendaId: TiendaId, pedidoId: number, ej: Ejecutor = db) =>
    (
      await ej
        .selectFrom('pedidoItems')
        .select([
          'id',
          'productoId',
          'nombre',
          'precioUnitario',
          'cantidad',
          'subtotal',
          'personalizacion',
          'fotoClave',
        ])
        .where('tiendaId', '=', tiendaId)
        .where('pedidoId', '=', pedidoId)
        .orderBy('id')
        .execute()
    ).map(({ fotoClave, ...i }) => ({ ...i, tieneFoto: fotoClave !== null })),

  // Para mover el stock (cancelar, aprobar): incluye si cada ítem reservó. No
  // se muestra nunca: es un dato interno.
  itemsDeStock: (tiendaId: TiendaId, pedidoId: number, ej: Ejecutor) =>
    ej
      .selectFrom('pedidoItems')
      .select(['productoId', 'cantidad', 'reservo'])
      .where('tiendaId', '=', tiendaId)
      .where('pedidoId', '=', pedidoId)
      .execute(),
};

export type Pedido = NonNullable<Awaited<ReturnType<typeof pedidosRepo.buscar>>>;
