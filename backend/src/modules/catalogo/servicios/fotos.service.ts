import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { borrarPublicos, subirWebp } from '../../../shared/archivos/almacenamiento.js';
import {
  baseFotoProducto,
  clavesDeFoto,
  TAMANOS,
} from '../../../shared/archivos/claves.js';
import { aWebp } from '../../../shared/archivos/procesarImagen.js';
import { validarImagen } from '../../../shared/archivos/validarImagen.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { MAX_FOTOS } from '../limites.js';
import { fotosRepo } from '../repositorios/fotos.repository.js';
import { verProducto } from './productos.service.js';
import { presentarFoto } from './urlsFoto.js';

const noEncontrado = () =>
  new AppError(404, 'producto_no_encontrado', 'No encontramos ese producto.');
const lleno = () =>
  new AppError(
    409,
    'demasiadas_fotos',
    `Cada producto puede tener hasta ${MAX_FOTOS} fotos.`,
  );

// Chequeos baratos → valida → reprocesa a WebP → sube → registra.
// Si algo falla después de empezar a subir, se borra lo subido.
export async function agregarFoto(
  tiendaId: TiendaId,
  productoId: number,
  archivo: Buffer,
) {
  await verProducto(tiendaId, productoId);
  if ((await fotosRepo.listar(tiendaId, productoId)).length >= MAX_FOTOS) throw lleno();
  await validarImagen(archivo);
  const [grande, chica] = await aWebp(archivo, [TAMANOS.grande, TAMANOS.chica]);

  const base = baseFotoProducto(tiendaId, productoId);
  const claves = clavesDeFoto(base);
  try {
    await Promise.all([
      subirWebp(claves.grande, grande!),
      subirWebp(claves.chica, chica!),
    ]);
  } catch (err) {
    await borrarPublicos(tiendaId, Object.values(claves));
    throw err;
  }
  // Si registrar tira un error, NO se borran los archivos: puede que el COMMIT
  // se haya aplicado igual (conexión cortada). Si no se aplicó, quedan sin
  // referencia y el barrido de huérfanos los limpia a las 24 h.
  const r = await fotosRepo.registrar(tiendaId, productoId, base, MAX_FOTOS);
  if (r.estado !== 'ok') {
    await borrarPublicos(tiendaId, Object.values(claves));
    throw r.estado === 'lleno' ? lleno() : noEncontrado();
  }
  return presentarFoto({ id: r.id, clave: base, orden: r.orden });
}

export async function listarFotos(tiendaId: TiendaId, productoId: number) {
  await verProducto(tiendaId, productoId);
  return (await fotosRepo.listar(tiendaId, productoId)).map(presentarFoto);
}

export async function borrarFoto(tiendaId: TiendaId, productoId: number, fotoId: number) {
  const base = await fotosRepo.borrar(tiendaId, productoId, fotoId);
  if (!base) throw new AppError(404, 'foto_no_encontrada', 'No encontramos esa foto.');
  await borrarPublicos(tiendaId, Object.values(clavesDeFoto(base)));
}
