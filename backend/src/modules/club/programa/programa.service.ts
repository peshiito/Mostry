import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { programaRepo as repo } from './programa.repository.js';
import type { ProgramaNuevo } from './schemas.js';

// El programa del panel. Si nunca lo armó, uno vacío con un nombre sugerido.
export async function verPrograma(tiendaId: TiendaId) {
  const [tienda, programa, premios] = await Promise.all([
    repo.tienda(tiendaId),
    repo.buscar(tiendaId),
    repo.premios(tiendaId),
  ]);
  return {
    activo: tienda.usaClub,
    nombre: programa?.nombre ?? `Club ${tienda.nombre}`.slice(0, 40),
    compraMinima: programa?.compraMinima ?? 0,
    venceMeses: programa?.venceMeses ?? null,
    premios,
  };
}

export async function guardarPrograma(tiendaId: TiendaId, p: ProgramaNuevo) {
  await repo.guardar(tiendaId, p);
  return verPrograma(tiendaId);
}

// Prenderlo exige al menos un premio guardado. Apagarlo no borra nada.
export async function prenderPrograma(tiendaId: TiendaId, activo: boolean) {
  if (activo && (await repo.premios(tiendaId)).length === 0)
    throw new AppError(
      400,
      'club_sin_premios',
      'Armá al menos un premio antes de prender el club.',
    );
  await repo.prender(tiendaId, activo);
  return verPrograma(tiendaId);
}

// Lo que ve la vidriera: solo si está prendido y tiene premios.
export async function programaPublico(tiendaId: TiendaId, usaClub: boolean) {
  if (!usaClub) return null;
  const [programa, premios] = await Promise.all([
    repo.buscar(tiendaId),
    repo.premios(tiendaId),
  ]);
  if (!programa || premios.length === 0) return null;
  return { ...programa, premios };
}
