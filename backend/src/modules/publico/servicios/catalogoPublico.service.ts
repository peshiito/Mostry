import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { catalogoExtrasRepo as extras } from '../repositorios/catalogoExtras.repository.js';
import {
  catalogoPublicoRepo as repo,
  type FiltrosPublicos,
} from '../repositorios/catalogoPublico.repository.js';
import {
  conFotoPrincipal,
  presentarProductoPublico,
} from './presentarProductoPublico.js';

const POR_PAGINA = 24;

export async function listarCatalogo(
  tiendaId: TiendaId,
  filtros: FiltrosPublicos,
  pagina: number,
) {
  const { filas, total } = await repo.productos(
    tiendaId,
    filtros,
    POR_PAGINA,
    (pagina - 1) * POR_PAGINA,
  );
  const fotos = await extras.fotos(
    tiendaId,
    filas.map((p) => p.id),
  );
  return {
    productos: filas.map((p) => conFotoPrincipal(presentarProductoPublico(p, fotos))),
    total,
    pagina,
    paginas: Math.max(1, Math.ceil(total / POR_PAGINA)),
  };
}

export async function verProductoPublico(tiendaId: TiendaId, id: number) {
  const producto = await repo.producto(tiendaId, id);
  if (!producto)
    throw new AppError(404, 'producto_no_encontrado', 'No encontramos ese producto.');
  return presentarProductoPublico(producto, await extras.fotos(tiendaId, [id]));
}

export async function listarCategoriasPublicas(tiendaId: TiendaId) {
  return (await extras.categorias(tiendaId)).map((c) => ({
    ...c,
    productos: Number(c.productos),
  }));
}
