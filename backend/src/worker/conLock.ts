import { sql } from 'kysely';
import { db } from '../shared/db/db.js';
import { logger } from '../shared/logger.js';

export type ResultadoLock<T> = { ejecutado: true; resultado: T } | { ejecutado: false };

// Corre la tarea solo si nadie más la está corriendo (GET_LOCK de MySQL, por
// nombre). Si otro worker la tiene, no espera: la saltea. CLAUDE.md 4.
export async function conLock<T>(
  nombre: string,
  tarea: () => Promise<T>,
): Promise<ResultadoLock<T>> {
  return db.connection().execute(async (conexion) => {
    const { rows } = await sql<{
      ok: number | null;
    }>`SELECT GET_LOCK(${`mostry:${nombre}`}, 0) AS ok`.execute(conexion);
    // 1 = lo tomamos; 0 = lo tiene otro worker; NULL = error de MySQL.
    if (rows[0]?.ok !== 1) {
      if (rows[0]?.ok === 0)
        logger.info({ tarea: nombre }, 'Tarea en curso en otro worker: se saltea');
      else logger.error({ tarea: nombre }, 'MySQL no pudo dar el lock de la tarea');
      return { ejecutado: false } as const;
    }
    const inicio = Date.now();
    try {
      const resultado = await tarea();
      logger.info(
        { tarea: nombre, ms: Date.now() - inicio, resultado },
        'Tarea terminada',
      );
      return { ejecutado: true, resultado } as const;
    } catch (err) {
      logger.error({ err, tarea: nombre, ms: Date.now() - inicio }, 'Tarea falló');
      throw err;
    } finally {
      await sql`SELECT RELEASE_LOCK(${`mostry:${nombre}`})`.execute(conexion);
    }
  });
}
