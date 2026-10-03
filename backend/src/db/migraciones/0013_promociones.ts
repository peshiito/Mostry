import { type Kysely, sql } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    CREATE TABLE promociones (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      tienda_id INT UNSIGNED NOT NULL,
      titulo VARCHAR(80) NOT NULL,
      descripcion VARCHAR(300) NULL,
      desde DATETIME NOT NULL,
      hasta DATETIME NOT NULL,
      activa BOOLEAN NOT NULL DEFAULT TRUE,
      creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      -- (tienda_id, id) permite FK compuestas: imposible apuntar a otra tienda.
      UNIQUE KEY uq_promociones_tienda (tienda_id, id),
      CONSTRAINT fk_promociones_tienda FOREIGN KEY (tienda_id) REFERENCES tiendas (id),
      KEY ix_promociones_vigentes (tienda_id, activa, hasta),
      CONSTRAINT ck_promociones_rango CHECK (desde < hasta)
    )
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`DROP TABLE promociones`.execute(db);
}
