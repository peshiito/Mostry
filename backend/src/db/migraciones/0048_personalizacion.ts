import { type Kysely, sql } from 'kysely';

// Encargos 2: productos que se personalizan (una torta con texto, sabor y
// relleno). El comprador escribe cómo lo quiere y puede sumar una foto de
// referencia, que va al bucket PRIVADO y se borra días después de cerrar el
// pedido (foto_borrar_en). Personalizar es solo para encargos.
export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`ALTER TABLE productos
    ADD COLUMN pide_personalizacion BOOLEAN NOT NULL DEFAULT FALSE AFTER acepta_encargo,
    ADD COLUMN indicacion_personalizacion VARCHAR(200) NULL AFTER pide_personalizacion,
    ADD CONSTRAINT ck_productos_personalizacion
      CHECK (pide_personalizacion = FALSE OR acepta_encargo = TRUE)`.execute(db);
  await sql`ALTER TABLE pedido_items
    ADD COLUMN personalizacion VARCHAR(500) NULL,
    ADD COLUMN foto_clave VARCHAR(255) NULL,
    ADD COLUMN foto_borrar_en DATETIME NULL,
    ADD INDEX ix_pedido_items_foto_borrar (foto_borrar_en)`.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`ALTER TABLE pedido_items DROP INDEX ix_pedido_items_foto_borrar,
    DROP COLUMN foto_borrar_en, DROP COLUMN foto_clave, DROP COLUMN personalizacion`.execute(
    db,
  );
  await sql`ALTER TABLE productos DROP CHECK ck_productos_personalizacion,
    DROP COLUMN indicacion_personalizacion, DROP COLUMN pide_personalizacion`.execute(db);
}
