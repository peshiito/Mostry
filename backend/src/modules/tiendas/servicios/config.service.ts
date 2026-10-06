import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { urlPublica } from '../../../shared/archivos/almacenamiento.js';
import { AppError } from '../../../shared/errors/AppError.js';
import type { DatosConfig } from '../schemas.js';
import { tiendaConfigRepo } from '../tiendaConfig.repository.js';

// El panel recibe la URL del logo, no la clave interna del bucket.
export async function verConfig(tiendaId: TiendaId) {
  const { logoClave, ...config } = await tiendaConfigRepo.buscar(tiendaId);
  return { ...config, logoUrl: logoClave ? urlPublica(logoClave) : null };
}

// Edita "Mi tienda". Tiene que quedar al menos una forma de entrega.
export async function editarConfig(tiendaId: TiendaId, cambios: DatosConfig) {
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
  return verConfig(tiendaId);
}

export async function pausarTienda(tiendaId: TiendaId, pausada: boolean) {
  await tiendaConfigRepo.actualizar(tiendaId, { pausada });
  return { pausada };
}
