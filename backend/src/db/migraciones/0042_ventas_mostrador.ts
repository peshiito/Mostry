import { type Kysely, sql } from 'kysely';

// Venta rápida en el local (Mejoras 3, parte C): la caja como punto de venta.
// Los ítems copian nombre y precio al vender. Un "monto suelto" es un ítem sin
// producto. Cada venta entra a la caja como movimiento con origen 'venta'.
export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`ALTER TABLE tiendas ADD COLUMN ultimo_numero_venta INT UNSIGNED NOT NULL DEFAULT 0`.execute(
    db,
  );
  await sql`
    CREATE TABLE ventas (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      tienda_id INT UNSIGNED NOT NULL,
      numero INT UNSIGNED NOT NULL,
      total INT UNSIGNED NOT NULL,
      medio ENUM('efectivo', 'transferencia') NOT NULL,
      creada_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uq_ventas_tienda (tienda_id, id),
      UNIQUE KEY uq_ventas_numero (tienda_id, numero),
      KEY ix_ventas_fecha (tienda_id, creada_en),
      CONSTRAINT fk_ventas_tienda FOREIGN KEY (tienda_id) REFERENCES tiendas (id),
      CONSTRAINT ck_ventas_total CHECK (total > 0)
    )
  `.execute(db);
  await sql`
    CREATE TABLE venta_items (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      tienda_id INT UNSIGNED NOT NULL,
      venta_id INT UNSIGNED NOT NULL,
      producto_id INT UNSIGNED NULL,
      nombre VARCHAR(100) NOT NULL,
      precio_unitario INT UNSIGNED NOT NULL,
      cantidad SMALLINT UNSIGNED NOT NULL,
      subtotal INT UNSIGNED NOT NULL,
      PRIMARY KEY (id),
      KEY ix_venta_items_venta (tienda_id, venta_id),
      CONSTRAINT fk_venta_items_tienda FOREIGN KEY (tienda_id) REFERENCES tiendas (id),
      CONSTRAINT fk_venta_items_venta FOREIGN KEY (tienda_id, venta_id)
        REFERENCES ventas (tienda_id, id),
      CONSTRAINT fk_venta_items_producto FOREIGN KEY (tienda_id, producto_id)
        REFERENCES productos (tienda_id, id),
      CONSTRAINT ck_venta_items_cantidad CHECK (cantidad > 0),
      CONSTRAINT ck_venta_items_subtotal CHECK (subtotal = precio_unitario * cantidad)
    )
  `.execute(db);
  await sql`ALTER TABLE movimientos_caja MODIFY origen
    ENUM('pedido', 'fiado', 'gasto', 'manual', 'venta') NOT NULL`.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`DELETE FROM movimientos_caja WHERE origen = 'venta'`.execute(db);
  await sql`ALTER TABLE movimientos_caja MODIFY origen
    ENUM('pedido', 'fiado', 'gasto', 'manual') NOT NULL`.execute(db);
  await sql`DROP TABLE venta_items`.execute(db);
  await sql`DROP TABLE ventas`.execute(db);
  await sql`ALTER TABLE tiendas DROP COLUMN ultimo_numero_venta`.execute(db);
}
