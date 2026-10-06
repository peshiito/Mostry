import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { listarProductosRepo } from '../repositorios/consultaProductos.js';
import type { FiltrosProductos } from '../schemas.js';
import { conDisponible } from './presentarProducto.js';

const POR_PAGINA = 50;
const ESTADO_A_ACTIVO = { activos: true, inactivos: false, todos: undefined } as const;

export async function listarProductos(tiendaId: TiendaId, f: FiltrosProductos) {
  const filtros = {
    buscar: f.buscar,
    categoriaId: f.categoriaId === 'sin' ? null : f.categoriaId,
    activos: ESTADO_A_ACTIVO[f.estado],
    stockBajo: f.stockBajo,
  };
  const desde = (f.pagina - 1) * POR_PAGINA;
  const { filas, total } = await listarProductosRepo(
    tiendaId,
    filtros,
    POR_PAGINA,
    desde,
  );
  return {
    productos: filas.map(conDisponible),
    total,
    pagina: f.pagina,
    paginas: Math.max(1, Math.ceil(total / POR_PAGINA)),
  };
}
