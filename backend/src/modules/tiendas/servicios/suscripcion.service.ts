import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { config } from '../../../config/env.js';
import { pagosTiendaRepo } from '../pagosTienda.repository.js';
import { tiendaConfigRepo } from '../tiendaConfig.repository.js';
import { estadoEfectivo, resumenSuscripcion } from './estadoSuscripcion.js';

// Estado + datos para pagarle a Mostry (banner y pantalla "Suscripción").
export async function verSuscripcion(tiendaId: TiendaId) {
  const fechas = await tiendaConfigRepo.suscripcion(tiendaId);
  return {
    ...resumenSuscripcion(fechas),
    pago: {
      alias: config.MOSTRY_ALIAS,
      titular: config.MOSTRY_TITULAR,
      monto: config.PRECIO_MENSUAL,
    },
  };
}

const DIA_MS = 24 * 60 * 60 * 1000;

// La nota de un pago es interna del admin; la de una cortesía es su motivo.
export async function verPagos(tiendaId: TiendaId) {
  const filas = await pagosTiendaRepo.ultimos(tiendaId);
  return filas.map((p) => ({
    id: p.id,
    tipo: p.tipo,
    monto: p.monto,
    fecha: p.pagadoEn,
    hasta: p.periodoHasta,
    ...(p.tipo === 'cortesia' && {
      dias: Math.round((p.periodoHasta.getTime() - p.periodoDesde.getTime()) / DIA_MS),
      motivo: p.nota,
    }),
  }));
}

export async function estaSuspendida(tiendaId: TiendaId): Promise<boolean> {
  return estadoEfectivo(await tiendaConfigRepo.suscripcion(tiendaId)) === 'suspendida';
}
