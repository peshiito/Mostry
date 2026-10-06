import { type Kysely, sql } from 'kysely';

// El nombre tiene que ser único solo entre categorías ACTIVAS: una desactivada
// no puede bloquear que se cree o renombre otra con su nombre. MySQL no tiene
// índices parciales: se usa una columna generada que es NULL si está inactiva
// (los NULL no chocan en un índice único).
export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    ALTER TABLE categorias
      ADD COLUMN nombre_activo VARCHAR(60) AS (IF(activa, nombre, NULL)) STORED AFTER activa,
      DROP INDEX uq_categorias_nombre,
      ADD UNIQUE KEY uq_categorias_nombre_activo (tienda_id, nombre_activo)
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`
    ALTER TABLE categorias
      DROP INDEX uq_categorias_nombre_activo,
      DROP COLUMN nombre_activo,
      ADD UNIQUE KEY uq_categorias_nombre (tienda_id, nombre)
  `.execute(db);
}
