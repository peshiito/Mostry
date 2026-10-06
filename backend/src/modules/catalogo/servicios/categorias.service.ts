import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { esDuplicado } from '../../../shared/db/esDuplicado.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { categoriasRepo } from '../repositorios/categorias.repository.js';
import { categoriasEscrituraRepo as escritura } from '../repositorios/categoriasEscritura.repository.js';
import { MAX_CATEGORIAS } from '../limites.js';

const noEncontrada = () =>
  new AppError(404, 'categoria_no_encontrada', 'No encontramos esa categoría.');

async function conNombreUnico<T>(accion: () => Promise<T>): Promise<T> {
  try {
    return await accion();
  } catch (err) {
    if (esDuplicado(err, 'uq_categorias_nombre_activo')) {
      throw new AppError(
        409,
        'categoria_repetida',
        'Ya tenés una categoría con ese nombre.',
      );
    }
    throw err;
  }
}

export const listarCategorias = (tiendaId: TiendaId) => categoriasRepo.listar(tiendaId);

export async function crearCategoria(tiendaId: TiendaId, nombre: string) {
  const actuales = await categoriasRepo.ids(tiendaId);
  if (actuales.length >= MAX_CATEGORIAS) {
    throw new AppError(
      409,
      'demasiadas_categorias',
      `Podés tener hasta ${MAX_CATEGORIAS} categorías.`,
    );
  }
  const orden = await categoriasRepo.siguienteOrden(tiendaId);
  const id = await conNombreUnico(() => escritura.crear(tiendaId, nombre, orden));
  return { id, nombre, orden };
}

export async function renombrarCategoria(tiendaId: TiendaId, id: number, nombre: string) {
  if (!(await conNombreUnico(() => escritura.renombrar(tiendaId, id, nombre))))
    throw noEncontrada();
  return { id, nombre };
}

// "Borrar" desactiva: la categoría desaparece del panel y de la tienda, pero no de la base.
export async function borrarCategoria(tiendaId: TiendaId, id: number) {
  if (!(await escritura.desactivar(tiendaId, id))) throw noEncontrada();
}
