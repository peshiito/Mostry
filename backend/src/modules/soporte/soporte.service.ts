import type { TiendaId } from '../../shared/db/tiendaId.js';
import { soporteRepo } from './soporte.repository.js';

// Lo que ve el comercio en "Acceso de soporte": si hay permiso y qué se hizo.
export async function estadoSoporte(tiendaId: TiendaId) {
  const [acceso, registro] = await Promise.all([
    soporteRepo.vigente(tiendaId),
    soporteRepo.registro(tiendaId),
  ]);
  return { acceso: acceso ? { venceEn: acceso.venceEn } : null, registro };
}

export async function darAcceso(tiendaId: TiendaId, usuarioId: number) {
  await soporteRepo.otorgar(tiendaId, usuarioId);
  return estadoSoporte(tiendaId);
}

export async function cortarAcceso(tiendaId: TiendaId) {
  await soporteRepo.revocar(tiendaId);
  return estadoSoporte(tiendaId);
}
