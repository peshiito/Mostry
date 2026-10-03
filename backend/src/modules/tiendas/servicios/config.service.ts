import { AppError } from '../../../shared/errors/AppError.js';
import type { DatosConfig } from '../schemas.js';
import { tiendaConfigRepo } from '../tiendaConfig.repository.js';

export const verConfig = (tiendaId: number) => tiendaConfigRepo.buscar(tiendaId);

// Edita "Mi tienda". Tiene que quedar al menos una forma de entrega.
export async function editarConfig(tiendaId: number, cambios: DatosConfig) {
  const actual = await tiendaConfigRepo.buscar(tiendaId);
  const envio = cambios.aceptaEnvio ?? actual.aceptaEnvio;
  const retiro = cambios.aceptaRetiro ?? actual.aceptaRetiro;
  if (!envio && !retiro) {
    throw new AppError(
      400,
      'entrega_requerida',
      'Tenés que ofrecer envío, retiro o los dos.',
    );
  }
  await tiendaConfigRepo.actualizar(tiendaId, cambios);
  return tiendaConfigRepo.buscar(tiendaId);
}

export async function pausarTienda(tiendaId: number, pausada: boolean) {
  await tiendaConfigRepo.actualizar(tiendaId, { pausada });
  return { pausada };
}
