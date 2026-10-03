import { type Kysely, sql } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    CREATE TABLE productos (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      tienda_id INT UNSIGNED NOT NULL,
      categoria_id INT UNSIGNED NULL,
      nombre VARCHAR(100) NOT NULL,
      descripcion TEXT NULL,
      precio INT UNSIGNED NOT NULL,
      stock INT UNSIGNED NOT NULL DEFAULT 0,
      stock_reservado INT UNSIGNED NOT NULL DEFAULT 0,
      stock_minimo INT UNSIGNED NOT NULL DEFAULT 0,
      agotado BOOLEAN NOT NULL DEFAULT FALSE,
      destacado BOOLEAN NOT NULL DEFAULT FALSE,
      activo BOOLEAN NOT NULL DEFAULT TRUE,
      acepta_encargo BOOLEAN NOT NULL DEFAULT FALSE,
      creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      -- (tienda_id, id) permite FK compuestas: imposible apuntar a otra tienda.
      UNIQUE KEY uq_productos_tienda (tienda_id, id),
      CONSTRAINT fk_productos_tienda FOREIGN KEY (tienda_id) REFERENCES tiendas (id),
      KEY ix_productos_catalogo (tienda_id, activo, categoria_id),
      KEY ix_productos_destacados (tienda_id, destacado),
      CONSTRAINT fk_productos_categoria FOREIGN KEY (tienda_id, categoria_id)
        REFERENCES categorias (tienda_id, id),
      -- Última barrera contra la sobreventa.
      CONSTRAINT ck_productos_reserva CHECK (stock_reservado <= stock)
    )
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`DROP TABLE productos`.execute(db);
}
