import { type Kysely, sql } from 'kysely';

// La cola de borrados ahora sabe de qué bucket es cada clave: un comprobante
// (bucket privado) nunca se "borra" por error del bucket público.
export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    ALTER TABLE archivos_por_borrar
      ADD COLUMN bucket ENUM('publico', 'privado') NOT NULL DEFAULT 'publico' AFTER id,
      DROP INDEX uq_archivos_clave,
      ADD UNIQUE KEY uq_archivos_bucket_clave (bucket, clave)
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`
    ALTER TABLE archivos_por_borrar
      DROP INDEX uq_archivos_bucket_clave,
      DROP COLUMN bucket,
      ADD UNIQUE KEY uq_archivos_clave (clave)
  `.execute(db);
}
