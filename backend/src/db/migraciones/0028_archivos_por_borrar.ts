import { type Kysely, sql } from 'kysely';

// Cola de archivos del bucket que no se pudieron borrar: el worker los reintenta.
export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    CREATE TABLE archivos_por_borrar (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      clave VARCHAR(255) NOT NULL,
      intentos TINYINT UNSIGNED NOT NULL DEFAULT 0,
      -- Próximo intento (espera creciente entre fallos).
      reintentar_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      ultimo_error VARCHAR(255) NULL,
      creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uq_archivos_clave (clave),
      KEY ix_archivos_reintentar (reintentar_en)
    )
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`DROP TABLE archivos_por_borrar`.execute(db);
}
