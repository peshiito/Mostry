import { type Kysely, sql } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    CREATE TABLE miembros_tienda (
      tienda_id INT UNSIGNED NOT NULL,
      usuario_id INT UNSIGNED NOT NULL,
      rol ENUM('dueno', 'empleado') NOT NULL DEFAULT 'dueno',
      creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (tienda_id, usuario_id),
      KEY ix_miembros_usuario (usuario_id),
      CONSTRAINT fk_miembros_tienda FOREIGN KEY (tienda_id) REFERENCES tiendas (id),
      CONSTRAINT fk_miembros_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
    )
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`DROP TABLE miembros_tienda`.execute(db);
}
