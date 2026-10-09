import { db } from '../../shared/db/db.js';
import type { EstadoReporte } from '../../shared/db/tipos/plataforma.js';

// Bandeja del admin (plataforma): ve los reportes de todas las tiendas, con el
// nombre de la tienda y del que reportó. Nada de datos del negocio.
const base = () =>
  db
    .selectFrom('reportes')
    .innerJoin('tiendas', 'tiendas.id', 'reportes.tiendaId')
    .innerJoin('usuarios', 'usuarios.id', 'reportes.usuarioId')
    .select([
      'reportes.id',
      'reportes.numero',
      'reportes.pantalla',
      'reportes.descripcion',
      'reportes.estado',
      'reportes.respuesta',
      'reportes.navegador',
      'reportes.creadoEn',
      'reportes.tiendaId',
      'tiendas.nombre as tienda',
      'tiendas.slug',
      'tiendas.whatsapp',
      'usuarios.nombre as autor',
      'usuarios.email',
    ]);

export const reportesAdminRepo = {
  listar: (estado?: EstadoReporte) => {
    let q = base().select((eb) =>
      eb('reportes.claveCaptura', 'is not', null).as('conCaptura'),
    );
    if (estado) q = q.where('reportes.estado', '=', estado);
    return q.orderBy('reportes.id', 'desc').limit(200).execute();
  },

  buscar: (id: number) =>
    base()
      .select('reportes.claveCaptura')
      .where('reportes.id', '=', id)
      .executeTakeFirst(),

  actualizar: (
    id: number,
    datos: { estado: EstadoReporte; respuesta?: string | null; claveCaptura?: null },
  ) => db.updateTable('reportes').set(datos).where('id', '=', id).execute(),

  contarNuevos: async () =>
    Number(
      (
        await db
          .selectFrom('reportes')
          .select((eb) => eb.fn.countAll<number>().as('n'))
          .where('estado', '=', 'nuevo')
          .executeTakeFirstOrThrow()
      ).n,
    ),
};
