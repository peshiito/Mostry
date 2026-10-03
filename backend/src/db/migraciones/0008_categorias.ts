import { type Kysely, sql } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    CREATE TABLE categorias (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      tienda_id INT UNSIGNED NOT NULL,
      nombre VARCHAR(60) NOT NULL,
      orden SMALLINT UNSIGNED NOT NULL DEFAULT 0,
      creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      -- (tienda_id, id) permite FK compuestas: imposible apuntar a otra tienda.
      UNIQUE KEY uq_categorias_tienda (tienda_id, id),
      CONSTRAINT fk_categorias_tienda FOREIGN KEY (tienda_id) REFERENCES tiendas (id),
      UNIQUE KEY uq_categorias_nombre (tienda_id, nombre)
    )
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`DROP TABLE categorias`.execute(db);
}
