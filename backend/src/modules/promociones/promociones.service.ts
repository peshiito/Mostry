import type { TiendaId } from '../../shared/db/tiendaId.js';
import { AppError } from '../../shared/errors/AppError.js';
import { promocionesRepo as repo } from './promociones.repository.js';

type Nueva = {
  titulo: string;
  descripcion?: string | null;
  desde: Date;
  hasta: Date;
  activa?: boolean;
};

const noEncontrada = () =>
  new AppError(404, 'promocion_no_encontrada', 'No encontramos esa promoción.');
const rangoInvalido = () =>
  new AppError(400, 'rango_invalido', '"hasta" tiene que ser posterior a "desde".');

export const listarPromociones = (tiendaId: TiendaId) => repo.listar(tiendaId);

export async function crearPromocion(tiendaId: TiendaId, d: Nueva) {
  if (d.hasta <= new Date())
    throw new AppError(400, 'promocion_vencida', 'La promoción ya estaría vencida.');
  const id = await repo.crear(tiendaId, {
    titulo: d.titulo,
    descripcion: d.descripcion ?? null,
    desde: d.desde,
    hasta: d.hasta,
    activa: d.activa ?? true,
  });
  return repo.buscar(tiendaId, id);
}

// Se edita o se desactiva (activa: false). No se borra.
export async function editarPromocion(
  tiendaId: TiendaId,
  id: number,
  cambios: Partial<Nueva>,
) {
  const actual = await repo.buscar(tiendaId, id);
  if (!actual) throw noEncontrada();
  if ((cambios.desde ?? actual.desde) >= (cambios.hasta ?? actual.hasta))
    throw rangoInvalido();
  await repo.actualizar(tiendaId, id, cambios);
  return repo.buscar(tiendaId, id);
}
