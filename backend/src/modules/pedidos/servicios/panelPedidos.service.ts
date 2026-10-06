import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { AppError } from '../../../shared/errors/AppError.js';
import {
  listarPedidosRepo,
  type FiltrosPedidos,
} from '../repositorios/pedidosLista.repository.js';
import { pedidosRepo } from '../repositorios/pedidos.repository.js';
import { camposPanel } from './camposPanel.js';
import { tiendaParaPedido } from '../repositorios/tiendaParaPedido.repository.js';
import { urlSeguimiento } from './urlSeguimiento.js';
import { linkWhatsapp } from './whatsapp.js';

const POR_PAGINA = 30;

export const pedidoNoEncontrado = () =>
  new AppError(404, 'pedido_no_encontrado', 'No encontramos ese pedido.');

export async function listarPedidos(
  tiendaId: TiendaId,
  filtros: FiltrosPedidos,
  pagina: number,
) {
  const { filas, total } = await listarPedidosRepo(
    tiendaId,
    filtros,
    POR_PAGINA,
    (pagina - 1) * POR_PAGINA,
  );
  return {
    pedidos: filas,
    total,
    pagina,
    paginas: Math.max(1, Math.ceil(total / POR_PAGINA)),
  };
}

// Detalle con ítems y el link de WhatsApp listo para el estado actual.
export async function verPedido(tiendaId: TiendaId, id: number) {
  const p = await pedidosRepo.buscar(tiendaId, id);
  if (!p) throw pedidoNoEncontrado();
  const [items, tienda] = await Promise.all([
    pedidosRepo.items(tiendaId, id),
    tiendaParaPedido(tiendaId),
  ]);
  const seguimiento = urlSeguimiento(tienda.slug, p.tokenSeguimiento);
  return {
    ...camposPanel(p),
    items,
    seguimiento,
    whatsapp: linkWhatsapp(p, tienda.nombre, seguimiento),
  };
}
