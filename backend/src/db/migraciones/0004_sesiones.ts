import { type Kysely, sql } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    CREATE TABLE sesiones (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      usuario_id INT UNSIGNED NOT NULL,
      tipo ENUM('panel', 'admin') NOT NULL,
      -- SHA-256 del token de la cookie; el token en claro nunca se guarda.
      hash_token CHAR(64) NOT NULL,
      expira_en DATETIME NOT NULL,
      ip VARCHAR(45) NULL,
      user_agent VARCHAR(255) NULL,
      ultimo_uso_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uq_sesiones_token (hash_token),
      KEY ix_sesiones_usuario (usuario_id),
      KEY ix_sesiones_expira (expira_en),
      CONSTRAINT fk_sesiones_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
    )
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`DROP TABLE sesiones`.execute(db);
}
