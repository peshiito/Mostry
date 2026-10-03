import { type Kysely, sql } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    CREATE TABLE clientes_libreta (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      tienda_id INT UNSIGNED NOT NULL,
      nombre VARCHAR(100) NOT NULL,
      telefono VARCHAR(15) NULL,
      activo BOOLEAN NOT NULL DEFAULT TRUE,
      -- El saldo NO se guarda: se calcula desde movimientos_fiado.
      creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      -- (tienda_id, id) permite FK compuestas: imposible apuntar a otra tienda.
      UNIQUE KEY uq_clientes_libreta_tienda (tienda_id, id),
      CONSTRAINT fk_clientes_libreta_tienda FOREIGN KEY (tienda_id) REFERENCES tiendas (id),
      KEY ix_clientes_nombre (tienda_id, activo, nombre)
    )
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`DROP TABLE clientes_libreta`.execute(db);
}
