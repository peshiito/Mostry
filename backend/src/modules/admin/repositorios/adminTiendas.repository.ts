import type { ExpressionBuilder } from 'kysely';
import { db } from '../../../shared/db/db.js';
import type { Database } from '../../../shared/db/tipos/index.js';
import { patronContiene } from '../../../shared/db/escaparLike.js';

// Dato de contacto del dueño de la tienda (para el email y el saludo de WhatsApp).
const dueno = (eb: ExpressionBuilder<Database, 'tiendas'>) =>
  eb
    .selectFrom('miembrosTienda')
    .innerJoin('usuarios', 'usuarios.id', 'miembrosTienda.usuarioId')
    .whereRef('miembrosTienda.tiendaId', '=', 'tiendas.id')
    .where('miembrosTienda.rol', '=', 'dueno')
    .limit(1);

// Plataforma: el admin ve todas las tiendas. Pensado para el piloto (≤ 500).
export const adminTiendasRepo = {
  listar(buscar?: string) {
    let q = db
      .selectFrom('tiendas')
      .select([
        'tiendas.id',
        'tiendas.slug',
        'tiendas.nombre',
        'tiendas.estado',
        'tiendas.pruebaHasta',
        'tiendas.planHasta',
        'tiendas.suspendidaManual',
        'tiendas.creadoEn',
        'tiendas.whatsapp',
      ])
      .select((eb) => [
        dueno(eb).select('usuarios.email').as('emailDueno'),
        dueno(eb).select('usuarios.nombre').as('nombreDueno'),
      ])
      .orderBy('tiendas.creadoEn', 'desc')
      .limit(500);
    if (buscar) {
      const patron = patronContiene(buscar);
      q = q.where((eb) =>
        eb.or([
          eb('tiendas.slug', 'like', patron),
          eb('tiendas.nombre', 'like', patron),
          eb('tiendas.id', 'in', (sub) =>
            sub
              .selectFrom('miembrosTienda')
              .innerJoin('usuarios', 'usuarios.id', 'miembrosTienda.usuarioId')
              .select('miembrosTienda.tiendaId')
              .where('usuarios.email', 'like', patron),
          ),
        ]),
      );
    }
    return q.execute();
  },
};
