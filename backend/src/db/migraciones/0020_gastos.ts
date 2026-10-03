import { type Kysely, sql } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    CREATE TABLE gastos (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      tienda_id INT UNSIGNED NOT NULL,
      proveedor_id INT UNSIGNED NULL,
      tipo ENUM('gasto', 'inversion') NOT NULL,
      monto INT UNSIGNED NOT NULL,
      medio ENUM('efectivo', 'transferencia') NOT NULL,
      fecha DATETIME NOT NULL,
      detalle VARCHAR(200) NULL,
      creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      -- (tienda_id, id) permite FK compuestas: imposible apuntar a otra tienda.
      UNIQUE KEY uq_gastos_tienda (tienda_id, id),
      CONSTRAINT fk_gastos_tienda FOREIGN KEY (tienda_id) REFERENCES tiendas (id),
      KEY ix_gastos_fecha (tienda_id, fecha),
      CONSTRAINT fk_gastos_proveedor FOREIGN KEY (tienda_id, proveedor_id)
        REFERENCES proveedores (tienda_id, id),
      CONSTRAINT ck_gastos_monto CHECK (monto > 0)
    )
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`DROP TABLE gastos`.execute(db);
}
