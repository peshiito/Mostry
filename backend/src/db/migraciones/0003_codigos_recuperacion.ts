import { type Kysely, sql } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    CREATE TABLE codigos_recuperacion (
      -- Códigos de un solo uso por si se pierde el celular con el TOTP.
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
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`DROP TABLE codigos_recuperacion`.execute(db);
}
