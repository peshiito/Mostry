import { resumenSuscripcion } from '../../tiendas/servicios/estadoSuscripcion.js';
import { adminTiendasRepo } from '../repositorios/adminTiendas.repository.js';
import type { FiltrosListado } from '../schemas.js';

const POR_PAGINA = 25;
const DIAS_POR_VENCER = 2;

type Fila = Awaited<ReturnType<typeof adminTiendasRepo.listar>>[number];
type ConEstado = Fila & ReturnType<typeof resumenSuscripcion>;

// Para escribirle a tiempo: vence en 2 días o menos, o ya está en gracia.
const porVencer = (t: ConEstado) =>
  t.estado === 'gracia' ||
  ((t.estado === 'prueba' || t.estado === 'activa') &&
    t.diasRestantes !== null &&
    t.diasRestantes <= DIAS_POR_VENCER);

// El estado se calcula en JS (depende de la fecha actual), por eso el filtro
// y la paginación van después de la consulta.
export async function listarTiendas({
  buscar,
  estado,
  pagina,
  porVencer: soloPorVencer,
}: FiltrosListado) {
  const ahora = new Date();
  const filas = await adminTiendasRepo.listar(buscar);
  let lista: ConEstado[] = filas.map((t) => ({ ...t, ...resumenSuscripcion(t, ahora) }));
  if (estado) lista = lista.filter((t) => t.estado === estado);
  if (soloPorVencer) {
    lista = lista
      .filter(porVencer)
      .sort((a, b) => (a.diasRestantes ?? 0) - (b.diasRestantes ?? 0));
  }
  const inicio = (pagina - 1) * POR_PAGINA;
  return {
    tiendas: lista
      .slice(inicio, inicio + POR_PAGINA)
      .map(({ mostrarAviso: _, finGracia: __, ...t }) => t),
    total: lista.length,
    pagina,
    paginas: Math.max(1, Math.ceil(lista.length / POR_PAGINA)),
  };
}
