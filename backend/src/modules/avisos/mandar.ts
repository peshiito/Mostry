import { db } from '../../shared/db/db.js';
import type { TiendaId } from '../../shared/db/tiendaId.js';
import { destinatarios, pendientesDeTienda } from './destinatarios.js';
import { enSilencio } from './silencio.js';
import { transportePush, type ContenidoPush } from './transporte.js';

type Texto = Omit<ContenidoPush, 'silencioso' | 'pendientes'>;

// Manda el aviso a todos los teléfonos de la tienda. Un teléfono que ya no
// existe se borra. Si no llegó a ninguno por fallas, lanza (se reintenta).
export async function mandarATienda(tiendaId: TiendaId, texto: Texto, ahora: Date) {
  const [telefonos, pendientes] = await Promise.all([
    destinatarios(tiendaId),
    pendientesDeTienda(tiendaId),
  ]);
  const resultados = await Promise.allSettled(
    telefonos.map((d) =>
      transportePush.enviar(d, {
        ...texto,
        pendientes,
        silencioso: enSilencio(d.silencioDesde, d.silencioHasta, ahora),
      }),
    ),
  );
  const muertos = telefonos.filter((_, i) => {
    const r = resultados[i]!;
    return r.status === 'fulfilled' && r.value === 'no_existe';
  });
  if (muertos.length)
    await db
      .deleteFrom('suscripcionesPush')
      .where(
        'id',
        'in',
        muertos.map((d) => d.id),
      )
      .execute();
  const fallas = resultados.filter((r) => r.status === 'rejected');
  if (telefonos.length > 0 && fallas.length === telefonos.length)
    throw (fallas[0] as PromiseRejectedResult).reason;
}
