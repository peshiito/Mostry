import { urlFirmada, VIGENCIA_URL_S } from '../../../shared/archivos/privado.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { pedidosRepo } from '../../pedidos/repositorios/pedidos.repository.js';
import { comprobantesRepo } from '../repositorios/comprobantes.repository.js';

// Lista de comprobantes del pedido (sin la clave interna del archivo).
export async function listarComprobantes(tiendaId: TiendaId, pedidoId: number) {
  if (!(await pedidosRepo.buscar(tiendaId, pedidoId))) {
    throw new AppError(404, 'pedido_no_encontrado', 'No encontramos ese pedido.');
  }
  const filas = await comprobantesRepo.listar(tiendaId, pedidoId);
  return filas.map(({ archivoClave, ...c }) => ({
    ...c,
    archivoDisponible: archivoClave !== null,
  }));
}

// URL firmada de 5 minutos para ver el archivo. Solo miembros de la tienda (la
// ruta pasa por accesoPanel) y solo mientras el archivo exista.
export async function verArchivo(tiendaId: TiendaId, pedidoId: number, id: number) {
  const c = await comprobantesRepo.buscar(tiendaId, pedidoId, id);
  if (!c)
    throw new AppError(
      404,
      'comprobante_no_encontrado',
      'No encontramos ese comprobante.',
    );
  if (!c.archivoClave)
    throw new AppError(
      410,
      'archivo_borrado',
      'El archivo ya se borró (los guardamos solo unas horas).',
    );
  const extension = c.archivoClave.split('.').pop();
  const url = await urlFirmada(
    c.archivoClave,
    `comprobante-${pedidoId}-${id}.${extension}`,
  );
  return { url, venceEn: new Date(Date.now() + VIGENCIA_URL_S * 1000) };
}
