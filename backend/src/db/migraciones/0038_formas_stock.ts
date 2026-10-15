import { type Kysely, sql } from 'kysely';

// Formas de manejar el stock (Mejoras 3): contar unidades, solo "hay / no hay"
// o hacer a pedido. La tienda tiene una por defecto y cada producto la suya.
// `pedido_items.reservo` anota si ese ítem reservó stock al comprarse: así,
// aunque el producto cambie de forma después, se libera o descuenta lo justo.
const FORMAS = sql`ENUM('unidades', 'simple', 'a_pedido') NOT NULL DEFAULT 'unidades'`;

export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`ALTER TABLE tiendas ADD COLUMN modo_stock ${FORMAS}`.execute(db);
  await sql`ALTER TABLE productos ADD COLUMN modo_stock ${FORMAS} AFTER precio`.execute(
    db,
  );
  // Lo que se hace a pedido siempre se puede encargar (si no, no se podría vender).
  await sql`ALTER TABLE productos ADD CONSTRAINT ck_productos_a_pedido
    CHECK (modo_stock <> 'a_pedido' OR acepta_encargo = TRUE)`.execute(db);
  await sql`ALTER TABLE pedido_items ADD COLUMN reservo BOOLEAN NOT NULL DEFAULT TRUE`.execute(
    db,
  );
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`ALTER TABLE pedido_items DROP COLUMN reservo`.execute(db);
  await sql`ALTER TABLE productos DROP CHECK ck_productos_a_pedido`.execute(db);
  await sql`ALTER TABLE productos DROP COLUMN modo_stock`.execute(db);
  await sql`ALTER TABLE tiendas DROP COLUMN modo_stock`.execute(db);
}
