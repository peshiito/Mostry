import { type Kysely, sql } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    CREATE TABLE movimientos_fiado (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      tienda_id INT UNSIGNED NOT NULL,
      cliente_id INT UNSIGNED NOT NULL,
      tipo ENUM('deuda', 'pago') NOT NULL,
      monto INT UNSIGNED NOT NULL,
      detalle VARCHAR(200) NULL,
      fecha DATETIME NOT NULL,
      creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      -- (tienda_id, id) permite FK compuestas: imposible apuntar a otra tienda.
      UNIQUE KEY uq_movimientos_fiado_tienda (tienda_id, id),
      CONSTRAINT fk_movimientos_fiado_tienda FOREIGN KEY (tienda_id) REFERENCES tiendas (id),
      KEY ix_fiado_cliente (tienda_id, cliente_id, fecha),
      CONSTRAINT fk_fiado_cliente FOREIGN KEY (tienda_id, cliente_id)
        REFERENCES clientes_libreta (tienda_id, id),
      CONSTRAINT ck_fiado_monto CHECK (monto > 0)
    )
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`DROP TABLE movimientos_fiado`.execute(db);
}
