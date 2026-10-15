import type { Ejecutor } from '../../../shared/db/ejecutor.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';

const dia = (d: Date | string) => new Date(d).toISOString().slice(0, 10);

// Lo único que queda de la tienda: nombre, link, fechas y lo que pagó. Sin
// email, teléfono ni datos de compradores (decisión de Pedro, Mejoras 4).
export async function guardarResumen(
  tx: Ejecutor,
  tienda: { id: TiendaId; nombre: string; slug: string; creadoEn: Date },
) {
  const pagos = await tx
    .selectFrom('pagosSuscripcion')
    .select(['monto', 'pagadoEn', 'periodoDesde', 'periodoHasta'])
    .where('tiendaId', '=', tienda.id)
    .orderBy('pagadoEn')
    .execute();
  const resumidos = pagos.map((p) => ({
    monto: p.monto,
    fecha: dia(p.pagadoEn),
    desde: dia(p.periodoDesde),
    hasta: dia(p.periodoHasta),
  }));
  await tx
    .insertInto('tiendasEliminadas')
    .values({
      nombre: tienda.nombre,
      slug: tienda.slug,
      altaEn: tienda.creadoEn,
      totalPagado: resumidos.reduce((s, p) => s + p.monto, 0),
      pagos: JSON.stringify(resumidos),
    })
    .execute();
}
