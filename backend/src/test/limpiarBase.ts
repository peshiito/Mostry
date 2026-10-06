import { sql } from 'kysely';
import { db } from '../shared/db/db.js';
import { vaciarBucketDeTest } from './bucket.js';

// Vacía todas las tablas de la base de test (no toca el esquema) y el bucket de test.
export async function limpiarBase(): Promise<void> {
  await db.connection().execute(async (conexion) => {
    const { rows } = await sql<{ tabla: string }>`
      SELECT table_name AS tabla FROM information_schema.tables
      WHERE table_schema = DATABASE() AND table_name NOT LIKE 'kysely_migraciones%'
    `.execute(conexion);
    await sql`SET FOREIGN_KEY_CHECKS = 0`.execute(conexion);
    for (const { tabla } of rows)
      await sql`TRUNCATE TABLE ${sql.table(tabla)}`.execute(conexion);
    await sql`SET FOREIGN_KEY_CHECKS = 1`.execute(conexion);
  });
  await vaciarBucketDeTest();
}
