import { type Kysely, sql } from 'kysely';

// Club Mostry (Lealtad L3): cada compra que llega al mínimo suma un sello en
// esa tienda. Pedidos y ventas guardan a qué cliente del club pertenecen (nulo
// para el comprador común). El saldo se calcula, no se guarda.
export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    CREATE TABLE sellos (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      tienda_id INT UNSIGNED NOT NULL,
      cliente_id INT UNSIGNED NOT NULL,
      origen ENUM('pedido', 'venta') NOT NULL,
      origen_id INT UNSIGNED NOT NULL,
      monto INT UNSIGNED NOT NULL,
      creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uq_sellos_tienda (tienda_id, id),
      UNIQUE KEY uq_sellos_origen (tienda_id, origen, origen_id),
      KEY ix_sellos_cliente (tienda_id, cliente_id, id),
      KEY ix_sellos_de_cliente (cliente_id),
      CONSTRAINT fk_sellos_tienda FOREIGN KEY (tienda_id) REFERENCES tiendas (id),
      CONSTRAINT fk_sellos_cliente FOREIGN KEY (cliente_id) REFERENCES clientes (id)
    )
  `.execute(db);
  for (const tabla of ['pedidos', 'ventas'])
    await sql`ALTER TABLE ${sql.table(tabla)}
      ADD COLUMN cliente_id INT UNSIGNED NULL,
      ADD KEY ${sql.raw(`ix_${tabla}_cliente`)} (cliente_id),
      ADD CONSTRAINT ${sql.raw(`fk_${tabla}_cliente`)} FOREIGN KEY (cliente_id) REFERENCES clientes (id)`.execute(
      db,
    );
}

export async function down(db: Kysely<unknown>): Promise<void> {
  for (const tabla of ['ventas', 'pedidos'])
    await sql`ALTER TABLE ${sql.table(tabla)}
      DROP FOREIGN KEY ${sql.raw(`fk_${tabla}_cliente`)},
      DROP KEY ${sql.raw(`ix_${tabla}_cliente`)},
      DROP COLUMN cliente_id`.execute(db);
  await sql`DROP TABLE sellos`.execute(db);
}
