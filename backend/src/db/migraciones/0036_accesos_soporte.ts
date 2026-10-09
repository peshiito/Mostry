import { type Kysely, sql } from 'kysely';

// Permiso que el comercio le da a Mostry para ayudarlo (1 hora, revocable).
// Sin un acceso vigente, el admin no puede operar el panel de la tienda.
export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    CREATE TABLE accesos_soporte (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      tienda_id INT UNSIGNED NOT NULL,
      otorgado_por INT UNSIGNED NOT NULL,
      creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      vence_en DATETIME NOT NULL,
      revocado_en DATETIME NULL,
      PRIMARY KEY (id),
      UNIQUE KEY uq_accesos_soporte_tienda_id (tienda_id, id),
      KEY ix_accesos_soporte_vigente (tienda_id, vence_en),
      CONSTRAINT fk_accesos_soporte_tienda FOREIGN KEY (tienda_id) REFERENCES tiendas (id),
      CONSTRAINT fk_accesos_soporte_usuario FOREIGN KEY (otorgado_por) REFERENCES usuarios (id),
      CONSTRAINT ck_accesos_soporte_plazo CHECK (vence_en > creado_en)
    )
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`DROP TABLE accesos_soporte`.execute(db);
}
