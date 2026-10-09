import { comoTiendaId } from '../../shared/db/tiendaId.js';
import { db } from '../../shared/db/db.js';
import { esDuplicado } from '../../shared/db/esDuplicado.js';
import type { EstadoTienda } from '../../shared/db/tipos/tiendas.js';
import type { Mailer } from '../../shared/email/mailer.js';
import { resumenSuscripcion } from '../../modules/tiendas/servicios/estadoSuscripcion.js';
import { avisoQueCorresponde, textoAviso } from './avisosSuscripcion.js';
import { enviarAviso } from './enviarAviso.js';

type Tienda = {
  id: number;
  nombre: string;
  estado: EstadoTienda;
  pruebaHasta: Date | null;
  planHasta: Date | null;
  suspendidaManual: boolean;
};
type Pago = { alias: string; titular: string; monto: number };

// Una tienda: guarda su estado y, si corresponde, le avisa (una vez por vencimiento).
export async function procesarTienda(t: Tienda, mailer: Mailer, pago: Pago, ahora: Date) {
  const tiendaId = comoTiendaId(t.id); // leído de la base (el worker recorre todas)
  const r = resumenSuscripcion(t, ahora);
  let actualizada = false;
  if (r.estado !== t.estado) {
    // Solo si nadie la cambió desde que se leyó (ej.: el admin registró un pago).
    const res = await db
      .updateTable('tiendas')
      .set({ estado: r.estado })
      .where('id', '=', t.id)
      .where('estado', '=', t.estado)
      .executeTakeFirst();
    actualizada = res.numUpdatedRows === 1n;
  }
  const horas = r.venceEl ? (r.venceEl.getTime() - ahora.getTime()) / 3_600_000 : null;
  const tipo = t.suspendidaManual ? null : avisoQueCorresponde(r.estado, horas);
  if (!tipo || !r.venceEl) return { actualizada, avisada: false };
  try {
    await db
      .insertInto('avisosSuscripcion')
      .values({ tiendaId, tipo, vence: r.venceEl })
      .execute();
  } catch (err) {
    if (esDuplicado(err, 'uq_avisos')) return { actualizada, avisada: false }; // ya se avisó
    throw err;
  }
  // Se marca ANTES de mandar (dos workers no mandan dos veces) y, si no le llegó
  // a nadie, se desmarca para reintentarlo en la próxima corrida.
  if (await enviarAviso(mailer, { tiendaId, ...textoAviso(tipo, t.nombre, pago) }))
    return { actualizada, avisada: true };
  await db
    .deleteFrom('avisosSuscripcion')
    .where('tiendaId', '=', tiendaId)
    .where('tipo', '=', tipo)
    .where('vence', '=', r.venceEl)
    .execute();
  return { actualizada, avisada: false };
}
