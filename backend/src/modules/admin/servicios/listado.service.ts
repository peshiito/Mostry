import { estadoEfectivo } from '../../tiendas/servicios/estadoSuscripcion.js';
import { adminTiendasRepo } from '../repositorios/adminTiendas.repository.js';
import type { FiltrosListado } from '../schemas.js';

const POR_PAGINA = 25;

// El estado se calcula en JS (depende de la fecha actual), por eso el filtro
// y la paginación van después de la consulta.
export async function listarTiendas({ buscar, estado, pagina }: FiltrosListado) {
  const ahora = new Date();
  const filas = await adminTiendasRepo.listar(buscar);
  const conEstado = filas.map((t) => ({ ...t, estado: estadoEfectivo(t, ahora) }));
  const filtradas = estado ? conEstado.filter((t) => t.estado === estado) : conEstado;
  const inicio = (pagina - 1) * POR_PAGINA;
  return {
    tiendas: filtradas.slice(inicio, inicio + POR_PAGINA),
    total: filtradas.length,
    pagina,
    paginas: Math.max(1, Math.ceil(filtradas.length / POR_PAGINA)),
  };
}
