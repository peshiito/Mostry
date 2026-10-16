import { db } from '../../../shared/db/db.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { enArgentina, inicioDiaAr } from '../../../shared/utils/horaArgentina.js';

const DIA_MS = 24 * 60 * 60 * 1000;

// Lo que espera al comercio a la mañana: comprobantes para revisar, encargos
// por aceptar y, como dato, los encargos que se entregan hoy.
export async function conteoResumen(tiendaId: TiendaId, ahora: Date) {
  const desde = inicioDiaAr(enArgentina(ahora).fecha);
  const r = await db
    .selectFrom('pedidos')
    .select((eb) => [
      eb.fn
        .sum<number>(
          eb.case().when('estado', '=', 'comprobante_enviado').then(1).else(0).end(),
        )
        .as('comprobantes'),
      eb.fn
        .sum<number>(
          eb
            .case()
            .when(
              eb.and([
                eb('estado', '=', 'pendiente_confirmacion'),
                eb('tipo', '=', 'encargo'),
              ]),
            )
            .then(1)
            .else(0)
            .end(),
        )
        .as('porAceptar'),
      eb.fn
        .sum<number>(
          eb
            .case()
            .when(
              eb.and([
                eb('tipo', '=', 'encargo'),
                eb('estado', 'not in', [
                  'cancelado',
                  'entregado',
                  'pendiente_confirmacion',
                ]),
                eb('fechaEncargo', '>=', desde),
                eb('fechaEncargo', '<', new Date(desde.getTime() + DIA_MS)),
              ]),
            )
            .then(1)
            .else(0)
            .end(),
        )
        .as('encargosHoy'),
    ])
    .where('tiendaId', '=', tiendaId)
    .where('estado', 'not in', ['cancelado', 'entregado'])
    .executeTakeFirstOrThrow();
  return {
    comprobantes: Number(r.comprobantes ?? 0),
    porAceptar: Number(r.porAceptar ?? 0),
    encargosHoy: Number(r.encargosHoy ?? 0),
  };
}

export type Conteo = Awaited<ReturnType<typeof conteoResumen>>;
