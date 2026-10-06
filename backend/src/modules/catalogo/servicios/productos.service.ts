import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { productosRepo } from '../repositorios/productos.repository.js';
import { conCategoriaValida } from './categoriaValida.js';
import type { CambiosProducto, DatosProducto } from '../schemas.js';
import { conDisponible } from './presentarProducto.js';

const noEncontrado = () =>
  new AppError(404, 'producto_no_encontrado', 'No encontramos ese producto.');

export async function verProducto(tiendaId: TiendaId, id: number) {
  const producto = await productosRepo.buscar(tiendaId, id);
  if (!producto) throw noEncontrado();
  return conDisponible(producto);
}

export async function crearProducto(tiendaId: TiendaId, datos: DatosProducto) {
  const id = await conCategoriaValida(tiendaId, datos.categoriaId, (tx) =>
    productosRepo.crear(tiendaId, datos, tx),
  );
  return verProducto(tiendaId, id);
}

// Todo o nada: si algo falla, no se guarda ningún cambio.
export async function editarProducto(
  tiendaId: TiendaId,
  id: number,
  datos: CambiosProducto,
) {
  await verProducto(tiendaId, id);
  const { stockAnterior, ...cambios } = datos;
  const ok = await conCategoriaValida(tiendaId, cambios.categoriaId, (tx) =>
    productosRepo.actualizar(tiendaId, id, cambios, stockAnterior, tx),
  );
  if (ok) return verProducto(tiendaId, id);

  // El UPDATE no aplicó: o cambió el stock mientras editaba, o hay unidades reservadas.
  const ahora = await verProducto(tiendaId, id);
  if (ahora.stock !== stockAnterior) {
    throw new AppError(
      409,
      'stock_cambio',
      `El stock cambió mientras editabas (ahora hay ${ahora.stock}). Revisalo y guardá de nuevo.`,
    );
  }
  throw new AppError(
    409,
    'stock_reservado',
    'Hay pedidos con unidades reservadas: el stock no puede ser menor.',
  );
}
