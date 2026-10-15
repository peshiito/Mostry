import type { Ejecutor } from '../../shared/db/ejecutor.js';
import { db } from '../../shared/db/db.js';
import type { TiendaId } from '../../shared/db/tiendaId.js';
import { AppError } from '../../shared/errors/AppError.js';
import { enArgentina, inicioDiaAr } from '../../shared/utils/horaArgentina.js';

const DIA_MS = 24 * 60 * 60 * 1000;

// Encargos no cancelados del día (en hora de Argentina) de esa fecha.
export async function encargosDelDia(
  tiendaId: TiendaId,
  fecha: string,
  ej: Ejecutor = db,
) {
  const desde = inicioDiaAr(fecha);
  const q = ej
    .selectFrom('pedidos')
    .select((eb) => eb.fn.countAll<number>().as('n'))
    .where('tiendaId', '=', tiendaId)
    .where('tipo', '=', 'encargo')
    .where('estado', '!=', 'cancelado')
    .where('fechaEncargo', '>=', desde)
    .where('fechaEncargo', '<', new Date(desde.getTime() + DIA_MS));
  return Number((await q.executeTakeFirstOrThrow()).n);
}

// En el checkout, con la tienda ya bloqueada (siguienteNumero) y ANTES de
// cualquier otra lectura común: la foto de la transacción se toma acá y ve
// todos los encargos confirmados. De a uno por vez, diez a la vez por el
// último lugar no entran todos. Sin FOR SHARE: no toma locks de rango en el
// índice que puedan cruzarse con los de otra tienda.
export async function exigirCupo(
  tx: Ejecutor,
  tiendaId: TiendaId,
  cupo: number | null,
  fechaEncargo: Date,
) {
  if (cupo === null) return;
  const fecha = enArgentina(fechaEncargo).fecha;
  if ((await encargosDelDia(tiendaId, fecha, tx)) >= cupo)
    throw new AppError(
      409,
      'sin_cupo',
      'Ese día ya no toma más encargos. Elegí otro día.',
    );
}
