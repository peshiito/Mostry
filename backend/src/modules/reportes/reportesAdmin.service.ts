import { borrarConCola } from '../../shared/archivos/borrarConCola.js';
import { urlFirmada } from '../../shared/archivos/privado.js';
import type { EstadoReporte } from '../../shared/db/tipos/plataforma.js';
import { AppError } from '../../shared/errors/AppError.js';
import { reportesAdminRepo } from './reportesAdmin.repository.js';

const noExiste = () =>
  new AppError(404, 'reporte_no_encontrado', 'No encontramos ese reporte.');

export async function bandejaReportes(estado?: EstadoReporte) {
  const [reportes, nuevos] = await Promise.all([
    reportesAdminRepo.listar(estado),
    reportesAdminRepo.contarNuevos(),
  ]);
  return { reportes, nuevos };
}

// Detalle con la captura por URL firmada de 5 minutos (nunca la clave del bucket).
export async function detalleReporte(id: number) {
  const r = await reportesAdminRepo.buscar(id);
  if (!r) throw noExiste();
  const { claveCaptura, ...reporte } = r;
  const captura = claveCaptura
    ? await urlFirmada(claveCaptura, `reporte-${r.numero}.webp`)
    : null;
  return { ...reporte, captura };
}

// Cambia el estado y deja una respuesta que el comercio ve en "Mis reportes".
// Al resolverse, la captura se borra: ya no hace falta y es un dato de la tienda.
export async function responderReporte(
  id: number,
  datos: { estado: EstadoReporte; respuesta?: string | null },
) {
  const r = await reportesAdminRepo.buscar(id);
  if (!r) throw noExiste();
  const borrar = datos.estado === 'resuelto' && r.claveCaptura;
  await reportesAdminRepo.actualizar(id, {
    ...datos,
    ...(borrar && { claveCaptura: null }),
  });
  if (borrar) await borrarConCola([r.claveCaptura!], 'privado');
  return detalleReporte(id);
}
