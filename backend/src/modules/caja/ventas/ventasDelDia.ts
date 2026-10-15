import { db } from '../../../shared/db/db.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { enArgentina, inicioDiaAr } from '../../../shared/utils/horaArgentina.js';

const DIA_MS = 24 * 60 * 60 * 1000;

// Lo vendido en el local un día (hora argentina): cada venta con sus ítems, y
// lo más vendido del día (por unidades) para la caja.
export async function ventasDelDia(
  tiendaId: TiendaId,
  dia = enArgentina(new Date()).fecha,
) {
  const desde = inicioDiaAr(dia);
  const hasta = new Date(desde.getTime() + DIA_MS);
  const ventas = await db
    .selectFrom('ventas')
    .select(['id', 'numero', 'total', 'medio', 'creadaEn'])
    .where('tiendaId', '=', tiendaId)
    .where('creadaEn', '>=', desde)
    .where('creadaEn', '<', hasta)
    .orderBy('id', 'desc')
    .execute();
  const items = ventas.length
    ? await db
        .selectFrom('ventaItems')
        .select(['ventaId', 'productoId', 'nombre', 'cantidad', 'subtotal'])
        .where('tiendaId', '=', tiendaId)
        .where(
          'ventaId',
          'in',
          ventas.map((v) => v.id),
        )
        .execute()
    : [];
  const masVendidos = new Map<
    string,
    { nombre: string; cantidad: number; total: number }
  >();
  for (const i of items.filter((x) => x.productoId !== null)) {
    const m = masVendidos.get(i.nombre) ?? { nombre: i.nombre, cantidad: 0, total: 0 };
    masVendidos.set(i.nombre, {
      ...m,
      cantidad: m.cantidad + i.cantidad,
      total: m.total + i.subtotal,
    });
  }
  return {
    dia,
    total: ventas.reduce((s, v) => s + v.total, 0),
    ventas: ventas.map((v) => ({ ...v, items: items.filter((i) => i.ventaId === v.id) })),
    masVendidos: [...masVendidos.values()]
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5),
  };
}
