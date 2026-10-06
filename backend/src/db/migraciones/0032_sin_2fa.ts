import { type Kysely, sql } from 'kysely';

// Decisión de Pedro (Etapa 11): se entra solo con contraseña; si se la olvidan,
// se recupera con un código por email. Se van el TOTP y los códigos de recuperación.
export async function up(db: Kysely<unknown>): Promise<void> {
  // Las sesiones a medio camino (esperando el TOTP) ya no tienen sentido.
  await sql`DELETE FROM sesiones WHERE estado <> 'completa'`.execute(db);
  await sql`ALTER TABLE sesiones DROP COLUMN estado`.execute(db);
  await sql`DROP TABLE codigos_recuperacion`.execute(db);
  await sql`
    ALTER TABLE usuarios
      DROP COLUMN totp_ultimo_paso,
      DROP COLUMN totp_activado_en,
      DROP COLUMN totp_secreto_cifrado
  `.execute(db);
}

// Vuelve el esquema anterior (sin datos de TOTP: cada usuario lo configura de nuevo).
export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`
    ALTER TABLE usuarios
      ADD COLUMN totp_secreto_cifrado VARCHAR(255) NULL AFTER email_verificado_en,
      ADD COLUMN totp_activado_en DATETIME NULL AFTER totp_secreto_cifrado,
      ADD COLUMN totp_ultimo_paso INT UNSIGNED NULL AFTER totp_activado_en
  `.execute(db);
  await sql`
    CREATE TABLE codigos_recuperacion (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      usuario_id INT UNSIGNED NOT NULL,
      hash_codigo CHAR(64) NOT NULL,
      usado_en DATETIME NULL,
      creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY ix_codigos_recuperacion_usuario (usuario_id),
      CONSTRAINT fk_codigos_recuperacion_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
    )
  `.execute(db);
  await sql`
    ALTER TABLE sesiones
      ADD COLUMN estado ENUM('falta_totp', 'falta_configurar_totp', 'completa')
        NOT NULL DEFAULT 'completa' AFTER tipo
  `.execute(db);
}
