import { borrarConCola } from '../../shared/archivos/borrarConCola.js';
import { claveCapturaReporte } from '../../shared/archivos/claves.js';
import { subirPrivado } from '../../shared/archivos/privado.js';
import { aWebp } from '../../shared/archivos/procesarImagen.js';
import { validarImagen } from '../../shared/archivos/validarImagen.js';
import { db } from '../../shared/db/db.js';
import type { TiendaId } from '../../shared/db/tiendaId.js';
import { AppError } from '../../shared/errors/AppError.js';
import { capturasRepo } from './capturas.repository.js';
import { reportesRepo } from './reportes.repository.js';

const LADO_CAPTURA = 1600;
// La captura se adjunta justo después de crear el reporte (mismo formulario).
const VENTANA_CAPTURA_MS = 60 * 60 * 1000;

type Datos = { pantalla: string; descripcion: string };

export async function crearReporte(
  tiendaId: TiendaId,
  usuarioId: number,
  datos: Datos,
  navegador: string | undefined,
) {
  return db.transaction().execute((tx) =>
    reportesRepo.crear(tx, tiendaId, {
      ...datos,
      usuarioId,
      navegador: navegador?.slice(0, 255) ?? null,
    }),
  );
}

export const listarReportes = (tiendaId: TiendaId) => reportesRepo.listar(tiendaId);

// Captura opcional: JPG o PNG por contenido, pasada a WebP (sin metadatos) y al
// bucket privado. Solo una por reporte y solo mientras el reporte es nuevo.
export async function adjuntarCaptura(tiendaId: TiendaId, id: number, archivo: Buffer) {
  const r = await capturasRepo.buscar(tiendaId, id);
  if (!r) throw new AppError(404, 'reporte_no_encontrado', 'No encontramos ese reporte.');
  const tarde = Date.now() - r.creadoEn.getTime() > VENTANA_CAPTURA_MS;
  if (r.claveCaptura || r.estado !== 'nuevo' || tarde) {
    throw new AppError(
      409,
      'captura_no_permitida',
      'Este reporte ya no acepta una captura.',
    );
  }
  await validarImagen(archivo);
  const [webp] = await aWebp(archivo, [LADO_CAPTURA]);
  const clave = claveCapturaReporte(tiendaId, id);
  await subirPrivado(clave, webp!, 'image/webp');
  const res = await capturasRepo.ponerCaptura(tiendaId, id, clave);
  if (Number(res.numUpdatedRows) === 0) {
    await borrarConCola([clave], 'privado'); // otra subida ganó, o ya lo resolvieron
    throw new AppError(409, 'captura_no_permitida', 'Este reporte ya tiene una captura.');
  }
  return { ok: true };
}
