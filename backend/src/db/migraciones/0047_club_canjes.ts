import { type Kysely, sql } from 'kysely';

// Club Mostry (Lealtad L4): usar un premio gasta los sellos hasta
// `hasta_sello_id`. El premio se copia como estaba ese día. Si el pedido se
// cancela, el canje se anula (anulado_en) y los sellos vuelven.
// Una compra 100 % gratis deja la venta en $ 0: el CHECK pasa a total >= 0.
export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    CREATE TABLE canjes (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      tienda_id INT UNSIGNED NOT NULL,
      cliente_id INT UNSIGNED NOT NULL,
      compras TINYINT UNSIGNED NOT NULL,
      tipo ENUM('porcentaje', 'monto', 'regalo') NOT NULL,
      valor INT UNSIGNED NULL,
      tope INT UNSIGNED NULL,
      descripcion VARCHAR(80) NULL,
      hasta_sello_id INT UNSIGNED NOT NULL,
      descuento INT UNSIGNED NOT NULL,
      origen ENUM('pedido', 'venta') NOT NULL,
      origen_id INT UNSIGNED NOT NULL,
      anulado_en DATETIME NULL,
      creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uq_canjes_tienda (tienda_id, id),
      UNIQUE KEY uq_canjes_origen (tienda_id, origen, origen_id),
      KEY ix_canjes_cliente (tienda_id, cliente_id),
      KEY ix_canjes_de_cliente (cliente_id),
      CONSTRAINT fk_canjes_tienda FOREIGN KEY (tienda_id) REFERENCES tiendas (id),
      CONSTRAINT fk_canjes_cliente FOREIGN KEY (cliente_id) REFERENCES clientes (id)
    )
  `.execute(db);
  for (const tabla of ['pedidos', 'ventas'])
    await sql`ALTER TABLE ${sql.table(tabla)} ADD COLUMN descuento INT UNSIGNED NOT NULL DEFAULT 0`.execute(
      db,
    );
  await sql`ALTER TABLE ventas DROP CHECK ck_ventas_total, ADD CONSTRAINT ck_ventas_total CHECK (total >= 0)`.execute(
    db,
  );
  // El total del pedido ahora resta el premio (sumado, para no restar UNSIGNED).
  await sql`ALTER TABLE pedidos DROP CHECK ck_pedidos_total,
    ADD CONSTRAINT ck_pedidos_total CHECK (total + descuento = subtotal + costo_envio AND descuento <= subtotal)`.execute(
    db,
  );
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`ALTER TABLE pedidos DROP CHECK ck_pedidos_total`.execute(db);
  await sql`UPDATE pedidos SET total = subtotal + costo_envio WHERE descuento > 0`.execute(
    db,
  );
  await sql`ALTER TABLE pedidos ADD CONSTRAINT ck_pedidos_total CHECK (total = subtotal + costo_envio)`.execute(
    db,
  );
  await sql`DELETE FROM ventas WHERE total = 0`.execute(db);
  await sql`ALTER TABLE ventas DROP CHECK ck_ventas_total, ADD CONSTRAINT ck_ventas_total CHECK (total > 0)`.execute(
    db,
  );
  for (const tabla of ['ventas', 'pedidos'])
    await sql`ALTER TABLE ${sql.table(tabla)} DROP COLUMN descuento`.execute(db);
  await sql`DROP TABLE canjes`.execute(db);
}
