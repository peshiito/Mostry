import { borrarClaves } from '../../shared/archivos/borrarClaves.js';
import { nombreBucket, type TipoBucket } from '../../shared/archivos/buckets.js';
import { encolarBorrado, quitarDeCola } from '../../shared/archivos/colaBorrado.js';
import { logger } from '../../shared/logger.js';
import { clavesAnterioresA, clavesReferenciadas } from './clavesReferenciadas.js';

const UN_DIA = 24 * 60 * 60 * 1000;
// Freno de seguridad: si "sobra" más de esto, algo anda mal (base equivocada,
// restauración a medias) y es preferible no borrar nada y avisar.
const MAX_PROPORCION = 0.2;
const MINIMO_SIN_FRENO = 50;

type Opciones = { antiguedadMs?: number; ahora?: Date; bucket?: TipoBucket };

// Job: borra archivos que ninguna fila referencia (por ejemplo, si el proceso se
// cayó entre la subida y el registro). Solo toca archivos de más de 24 h, así
// nunca pisa una subida en curso. Sirve para el bucket público y el privado.
export async function barrerHuerfanos({
  antiguedadMs = UN_DIA,
  ahora = new Date(),
  bucket = 'publico',
}: Opciones = {}) {
  const viejas = await clavesAnterioresA(
    bucket,
    new Date(ahora.getTime() - antiguedadMs),
  );
  if (viejas.length === 0) return { revisadas: 0, borradas: 0, abortado: false };
  const referencias = await clavesReferenciadas(bucket);
  const huerfanas = viejas.filter((c) => !referencias.enUso(c));

  const sospechoso =
    (referencias.total === 0 && viejas.length > 0) ||
    (huerfanas.length > MINIMO_SIN_FRENO &&
      huerfanas.length > viejas.length * MAX_PROPORCION);
  if (sospechoso) {
    logger.error(
      { bucket, revisadas: viejas.length, huerfanas: huerfanas.length },
      'Barrido abortado: demasiados huérfanos',
    );
    return { revisadas: viejas.length, borradas: 0, abortado: true };
  }

  const fallos = await borrarClaves(huerfanas, nombreBucket(bucket));
  const fallidas = new Set(fallos.map((f) => f.clave));
  await quitarDeCola(
    huerfanas.filter((c) => !fallidas.has(c)),
    bucket,
  );
  await encolarBorrado(fallos, bucket);
  const resultado = {
    revisadas: viejas.length,
    borradas: huerfanas.length - fallos.length,
    abortado: false,
  };
  logger.info({ bucket, ...resultado }, 'Barrido de huérfanos terminado');
  return resultado;
}
