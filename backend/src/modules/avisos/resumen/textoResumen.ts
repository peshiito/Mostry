import { db } from '../../../shared/db/db.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { conteoResumen } from './conteo.js';
import { fraseResumen, totalResumen } from './frase.js';

// El push del resumen de la mañana (null si ya no queda nada esperando).
export async function textoResumen(tiendaId: TiendaId, ahora = new Date()) {
  const [c, t] = await Promise.all([
    conteoResumen(tiendaId, ahora),
    db
      .selectFrom('tiendas')
      .select('nombre')
      .where('id', '=', tiendaId)
      .executeTakeFirstOrThrow(),
  ]);
  if (totalResumen(c) === 0) return null;
  return {
    titulo: `☀️ Buen día, ${t.nombre}`,
    cuerpo: fraseResumen(c),
    // Comprobantes o encargos por aceptar: a Pedidos; si no, a la agenda.
    url: c.comprobantes || c.porAceptar ? '/panel/pedidos' : '/panel/encargos',
    tag: 'resumen',
  };
}
