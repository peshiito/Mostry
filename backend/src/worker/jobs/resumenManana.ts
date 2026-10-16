import { config } from '../../config/env.js';
import { encolarAviso } from '../../modules/avisos/encolar.js';
import { enviarAvisos } from '../../modules/avisos/enviar.js';
import { aperturaDeHoy } from '../../modules/avisos/resumen/apertura.js';
import { conteoResumen } from '../../modules/avisos/resumen/conteo.js';
import { fraseResumen, totalResumen } from '../../modules/avisos/resumen/frase.js';
import { db } from '../../shared/db/db.js';
import type { Mailer } from '../../shared/email/mailer.js';
import { comoTiendaId } from '../../shared/db/tiendaId.js';
import { enArgentina } from '../../shared/utils/horaArgentina.js';
import { enviarAviso } from './enviarAviso.js';

const VENTANA = 3 * 60; // desde que abre y hasta 3 h después

// Job (cada 15 min): a la hora de abrir, si quedó algo esperando, un resumen
// por push y por mail (la red de seguridad del que no vio el aviso de la
// noche o no activó los avisos). Una vez por día: clave resumen:AAAA-MM-DD.
export async function resumenManana(mailer: Mailer, ahora = new Date()) {
  const hoy = enArgentina(ahora);
  const tiendas = await db
    .selectFrom('tiendas')
    .select(['id', 'slug'])
    .where('estado', 'in', ['prueba', 'activa', 'gracia'])
    .where('pausada', '=', false)
    .execute();
  let enviados = 0;
  for (const t of tiendas) {
    const tiendaId = comoTiendaId(t.id);
    const abre = await aperturaDeHoy(tiendaId, ahora);
    if (hoy.minutos < abre || hoy.minutos >= abre + VENTANA) continue;
    const c = await conteoResumen(tiendaId, ahora);
    if (totalResumen(c) === 0) continue;
    const clave = `resumen:${hoy.fecha}`;
    const r = await encolarAviso(db, tiendaId, {
      tipo: 'resumen',
      pedidoId: null,
      clave,
    });
    if (Number(r[0]?.numInsertedOrUpdatedRows ?? 0) === 0) continue; // ya se mandó hoy
    const panel = `${config.URL_TIENDA.replace('{slug}', t.slug)}/panel`;
    await enviarAviso(mailer, {
      tiendaId,
      asunto: `Tenés ${totalResumen(c)} cosas esperando en Mostry`,
      texto: `¡Buen día! Te esperan: ${fraseResumen(c)}.\n\nEntrá a tu panel: ${panel}`,
    });
    await enviarAvisos({ tiendaId, ahora });
    enviados++;
  }
  return { tiendas: tiendas.length, enviados };
}
