import { type Kysely, sql } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    CREATE TABLE pedido_items (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      tienda_id INT UNSIGNED NOT NULL,
      pedido_id INT UNSIGNED NOT NULL,
      producto_id INT UNSIGNED NOT NULL,
      -- Copiados al momento de la compra: no cambian si después se edita el producto.
      nombre VARCHAR(100) NOT NULL,
      precio_unitario INT UNSIGNED NOT NULL,
      cantidad SMALLINT UNSIGNED NOT NULL,
      subtotal INT UNSIGNED NOT NULL,
      PRIMARY KEY (id),
      -- (tienda_id, id) permite FK compuestas: imposible apuntar a otra tienda.
      UNIQUE KEY uq_pedido_items_tienda (tienda_id, id),
      CONSTRAINT fk_pedido_items_tienda FOREIGN KEY (tienda_id) REFERENCES tiendas (id),
      KEY ix_items_pedido (tienda_id, pedido_id),
      CONSTRAINT fk_items_pedido FOREIGN KEY (tienda_id, pedido_id)
        REFERENCES pedidos (tienda_id, id),
      CONSTRAINT fk_items_producto FOREIGN KEY (tienda_id, producto_id)
        REFERENCES productos (tienda_id, id),
      CONSTRAINT ck_items_cantidad CHECK (cantidad > 0),
      CONSTRAINT ck_items_subtotal CHECK (subtotal = precio_unitario * cantidad)
    )
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`DROP TABLE pedido_items`.execute(db);
}
