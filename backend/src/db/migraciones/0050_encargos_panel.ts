import { type Kysely, sql } from 'kysely';

// Encargos 3: cada producto puede pedir su propia anticipación (NULL = la de
// la tienda; vale la mayor), y los pedidos anotan si los cargó el comerciante
// desde el panel (un encargo que le llegó por WhatsApp) o vinieron de la web.
export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`ALTER TABLE productos
    ADD COLUMN anticipacion_horas SMALLINT UNSIGNED NULL AFTER indicacion_personalizacion`.execute(
    db,
  );
  await sql`ALTER TABLE pedidos
    ADD COLUMN origen ENUM('web', 'panel') NOT NULL DEFAULT 'web' AFTER tipo`.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`ALTER TABLE pedidos DROP COLUMN origen`.execute(db);
  await sql`ALTER TABLE productos DROP COLUMN anticipacion_horas`.execute(db);
}
