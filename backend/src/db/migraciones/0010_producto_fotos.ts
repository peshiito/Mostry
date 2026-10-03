import { type Kysely, sql } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    CREATE TABLE producto_fotos (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      tienda_id INT UNSIGNED NOT NULL,
      producto_id INT UNSIGNED NOT NULL,
      clave VARCHAR(255) NOT NULL,
      orden TINYINT UNSIGNED NOT NULL DEFAULT 0,
      creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      -- (tienda_id, id) permite FK compuestas: imposible apuntar a otra tienda.
      UNIQUE KEY uq_producto_fotos_tienda (tienda_id, id),
      CONSTRAINT fk_producto_fotos_tienda FOREIGN KEY (tienda_id) REFERENCES tiendas (id),
      KEY ix_fotos_producto (tienda_id, producto_id, orden),
      CONSTRAINT fk_fotos_producto FOREIGN KEY (tienda_id, producto_id)
        REFERENCES productos (tienda_id, id)
    )
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`DROP TABLE producto_fotos`.execute(db);
}
