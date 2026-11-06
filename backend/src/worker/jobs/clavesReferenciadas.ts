import type { TipoBucket } from '../../shared/archivos/buckets.js';
import { db } from '../../shared/db/db.js';

// "tiendas/1/productos/7/uuid-1200.webp" → "tiendas/1/productos/7/uuid".
// Se compara por base y no por tamaño: si mañana cambian los tamaños, las
// fotos viejas siguen contando como usadas.
const baseDeClave = (clave: string) => clave.replace(/-\d+\.webp$/, '');

// Qué claves de cada bucket usa todavía la base de datos.
export async function clavesReferenciadas(bucket: TipoBucket) {
  if (bucket === 'privado') {
    // Comprobantes y capturas de reportes. total = TODAS las filas (aunque ya no
    // tengan archivo): que no quede ninguno con archivo es normal y no tiene que
    // activar el freno.
    const filas = await db.selectFrom('comprobantes').select('archivoClave').execute();
    const reportes = await db.selectFrom('reportes').select('claveCaptura').execute();
    // Fotos de referencia de encargos (Encargos 2).
    const fotos = await db
      .selectFrom('pedidoItems')
      .select('fotoClave')
      .where('fotoClave', 'is not', null)
      .execute();
    const claves = [
      ...filas.map((f) => f.archivoClave),
      ...reportes.map((r) => r.claveCaptura),
      ...fotos.map((f) => f.fotoClave),
    ];
    const usadas = new Set(claves.filter((c): c is string => c !== null));
    const total = filas.length + reportes.length + fotos.length;
    return { total, enUso: (c: string) => usadas.has(c) };
  }
  const fotos = await db.selectFrom('productoFotos').select('clave').execute();
  const logos = await db
    .selectFrom('tiendas')
    .select(['logoClave', 'portadaClave'])
    .execute();
  const galeria = await db.selectFrom('galeriaTienda').select('clave').execute();
  const bases = new Set(fotos.map((f) => f.clave));
  // Logos, portadas y fotos del local (Vidriera 2.0): una sola clave cada uno.
  const logosUsados = new Set(
    [
      ...logos.flatMap((l) => [l.logoClave, l.portadaClave]),
      ...galeria.map((g) => g.clave),
    ].filter((c): c is string => c !== null),
  );
  return {
    total: bases.size + logosUsados.size,
    enUso: (c: string) => logosUsados.has(c) || bases.has(baseDeClave(c)),
  };
}

export { clavesAnterioresA } from './clavesAnteriores.js';
