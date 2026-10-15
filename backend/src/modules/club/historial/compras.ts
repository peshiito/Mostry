import { db } from '../../../shared/db/db.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';

type Origen = 'pedido' | 'venta';
const clave = (origen: Origen, id: number) => `${origen}:${id}`;

// Las compras de un cliente del Club (pedidos no cancelados y ventas del local),
// con si sumaron sello y qué premio usaron. Con `tiendaId`, solo las de esa
// tienda (lo que ve el comercio); sin él, las de todas (lo que ve el cliente).
export async function comprasDe(clienteId: number, tiendaId?: TiendaId, limite = 50) {
  const [pedidos, ventas] = await Promise.all([
    db
      .selectFrom('pedidos')
      .select(['id', 'tiendaId', 'total', 'estado', 'creadoEn as fecha'])
      .where('clienteId', '=', clienteId)
      .where('estado', '<>', 'cancelado')
      .$if(tiendaId !== undefined, (q) => q.where('tiendaId', '=', tiendaId!))
      .orderBy('id', 'desc')
      .limit(limite)
      .execute(),
    db
      .selectFrom('ventas')
      .select(['id', 'tiendaId', 'total', 'creadaEn as fecha'])
      .where('clienteId', '=', clienteId)
      .$if(tiendaId !== undefined, (q) => q.where('tiendaId', '=', tiendaId!))
      .orderBy('id', 'desc')
      .limit(limite)
      .execute(),
  ]);
  const [sellos, canjes] = await Promise.all([
    db
      .selectFrom('sellos')
      .select(['origen', 'origenId'])
      .where('clienteId', '=', clienteId)
      .execute(),
    db
      .selectFrom('canjes')
      .select([
        'origen',
        'origenId',
        'compras',
        'tipo',
        'valor',
        'tope',
        'descripcion',
        'descuento',
      ])
      .where('clienteId', '=', clienteId)
      .where('anuladoEn', 'is', null)
      .execute(),
  ]);
  const conSello = new Set(sellos.map((s) => clave(s.origen, s.origenId)));
  const premios = new Map(
    canjes.map(({ origen, origenId, ...p }) => [clave(origen, origenId), p]),
  );
  const todas = [
    ...pedidos.map((p) => ({ ...p, origen: 'pedido' as const })),
    ...ventas.map((v) => ({ ...v, origen: 'venta' as const, estado: null })),
  ];
  return todas
    .sort((a, b) => b.fecha.getTime() - a.fecha.getTime())
    .slice(0, limite)
    .map((c) => ({
      ...c,
      sello: conSello.has(clave(c.origen, c.id)),
      premio: premios.get(clave(c.origen, c.id)) ?? null,
    }));
}
