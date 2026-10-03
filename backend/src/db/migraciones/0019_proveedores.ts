import { type Kysely, sql } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    CREATE TABLE proveedores (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      tienda_id INT UNSIGNED NOT NULL,
      nombre VARCHAR(100) NOT NULL,
      contacto VARCHAR(150) NULL,
      activo BOOLEAN NOT NULL DEFAULT TRUE,
      creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      -- (tienda_id, id) permite FK compuestas: imposible apuntar a otra tienda.
      UNIQUE KEY uq_proveedores_tienda (tienda_id, id),
      CONSTRAINT fk_proveedores_tienda FOREIGN KEY (tienda_id) REFERENCES tiendas (id),
      KEY ix_proveedores_nombre (tienda_id, nombre)
    )
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`DROP TABLE proveedores`.execute(db);
}
