import { type Kysely, sql } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    CREATE TABLE movimientos_caja (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      tienda_id INT UNSIGNED NOT NULL,
      -- NULL solo para transferencias que entran con la caja cerrada.
      caja_id INT UNSIGNED NULL,
      tipo ENUM('ingreso', 'egreso', 'deposito') NOT NULL,
      medio ENUM('efectivo', 'transferencia') NOT NULL,
      monto INT UNSIGNED NOT NULL,
      concepto VARCHAR(150) NOT NULL,
      origen ENUM('pedido', 'fiado', 'gasto', 'manual') NOT NULL,
      origen_id INT UNSIGNED NULL,
      fecha DATETIME NOT NULL,
      creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      -- (tienda_id, id) permite FK compuestas: imposible apuntar a otra tienda.
      UNIQUE KEY uq_movimientos_caja_tienda (tienda_id, id),
      CONSTRAINT fk_movimientos_caja_tienda FOREIGN KEY (tienda_id) REFERENCES tiendas (id),
      KEY ix_movimientos_fecha (tienda_id, fecha),
      KEY ix_movimientos_caja (tienda_id, caja_id),
      KEY ix_movimientos_origen (tienda_id, origen, origen_id),
      CONSTRAINT fk_movimientos_caja FOREIGN KEY (tienda_id, caja_id)
        REFERENCES cajas (tienda_id, id),
      CONSTRAINT ck_movimientos_monto CHECK (monto > 0),
      CONSTRAINT ck_movimientos_efectivo CHECK (medio <> 'efectivo' OR caja_id IS NOT NULL)
    )
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`DROP TABLE movimientos_caja`.execute(db);
}
