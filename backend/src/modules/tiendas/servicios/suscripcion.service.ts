import { config } from '../../../config/env.js';
import { tiendaConfigRepo } from '../tiendaConfig.repository.js';
import { estadoEfectivo, resumenSuscripcion } from './estadoSuscripcion.js';

// Estado + datos para pagarle a Mostry (banner y pantalla "Suscripción").
export async function verSuscripcion(tiendaId: number) {
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

export async function estaSuspendida(tiendaId: number): Promise<boolean> {
  return estadoEfectivo(await tiendaConfigRepo.suscripcion(tiendaId)) === 'suspendida';
}
