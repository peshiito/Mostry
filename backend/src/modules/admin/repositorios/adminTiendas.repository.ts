import { db } from '../../../shared/db/db.js';
import { patronContiene } from '../../../shared/db/escaparLike.js';

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
      ])
      .select((eb) =>
        eb
          .selectFrom('miembrosTienda')
          .innerJoin('usuarios', 'usuarios.id', 'miembrosTienda.usuarioId')
          .select('usuarios.email')
          .whereRef('miembrosTienda.tiendaId', '=', 'tiendas.id')
          .where('miembrosTienda.rol', '=', 'dueno')
          .limit(1)
          .as('emailDueno'),
      )
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

  buscarPorId: (id: number) =>
    db.selectFrom('tiendas').selectAll().where('id', '=', id).executeTakeFirst(),
};
