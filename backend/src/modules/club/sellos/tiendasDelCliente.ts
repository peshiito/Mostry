import { urlPublica } from '../../../shared/archivos/almacenamiento.js';
import { db } from '../../../shared/db/db.js';
import { programaRepo } from '../programa/programa.repository.js';
import { saldoDe } from './saldo.js';

// "Mis tiendas" del Club: cada tienda donde el cliente juntó sellos, con su
// tarjeta (programa, premios y saldo). Si la tienda apagó el club, igual
// aparece, marcada, y sus sellos quedan guardados.
export async function tiendasDelCliente(clienteId: number, ahora = new Date()) {
  const filas = await db
    .selectFrom('sellos')
    .innerJoin('tiendas', 'tiendas.id', 'sellos.tiendaId')
    .innerJoin('programasLealtad', 'programasLealtad.tiendaId', 'sellos.tiendaId')
    .select([
      'sellos.tiendaId',
      'tiendas.slug',
      'tiendas.nombre as tienda',
      'tiendas.logoClave',
      'tiendas.usaClub',
      'programasLealtad.nombre',
      'programasLealtad.compraMinima',
      'programasLealtad.venceMeses',
    ])
    .select((eb) => eb.fn.max('sellos.creadoEn').as('ultimo'))
    .where('sellos.clienteId', '=', clienteId)
    .groupBy('sellos.tiendaId')
    .orderBy('ultimo', 'desc')
    .execute();
  return Promise.all(
    filas.map(async (f) => {
      const { tiendaId } = f;
      return {
        slug: f.slug,
        tienda: f.tienda,
        logoUrl: f.logoClave ? urlPublica(f.logoClave) : null,
        activo: f.usaClub,
        nombre: f.nombre,
        compraMinima: f.compraMinima,
        venceMeses: f.venceMeses,
        premios: await programaRepo.premios(tiendaId),
        sellos: await saldoDe(tiendaId, clienteId, f.venceMeses, ahora),
      };
    }),
  );
}
