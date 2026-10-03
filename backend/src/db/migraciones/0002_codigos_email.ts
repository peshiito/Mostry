import { type Kysely, sql } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    CREATE TABLE codigos_email (
      -- Códigos de 6 dígitos por email (verificar email, recuperar clave, confirmar acciones).
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      usuario_id INT UNSIGNED NOT NULL,
      proposito ENUM('verificar_email', 'recuperar_clave', 'confirmar_accion') NOT NULL,
      hash_codigo CHAR(64) NOT NULL,
      intentos TINYINT UNSIGNED NOT NULL DEFAULT 0,
      expira_en DATETIME NOT NULL,
      usado_en DATETIME NULL,
      creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY ix_codigos_email_usuario (usuario_id, proposito, expira_en),
      CONSTRAINT fk_codigos_email_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id),
      CONSTRAINT ck_codigos_email_intentos CHECK (intentos <= 5)
    )
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`DROP TABLE codigos_email`.execute(db);
}
