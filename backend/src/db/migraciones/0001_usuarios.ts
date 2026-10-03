import { type Kysely, sql } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    CREATE TABLE usuarios (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      email VARCHAR(254) NOT NULL,
      hash_clave VARCHAR(255) NOT NULL,
      nombre VARCHAR(100) NOT NULL,
      es_admin BOOLEAN NOT NULL DEFAULT FALSE,
      email_verificado_en DATETIME NULL,
      -- Secreto TOTP cifrado con AES-256-GCM (la clave vive en .env).
      totp_secreto_cifrado VARCHAR(255) NULL,
      totp_activado_en DATETIME NULL,
      activo BOOLEAN NOT NULL DEFAULT TRUE,
      creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uq_usuarios_email (email)
    )
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`DROP TABLE usuarios`.execute(db);
}
