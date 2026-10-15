import { type Kysely, sql } from 'kysely';

// Encargos 2: máximo de encargos por día (NULL = sin límite), para que no le
// entren 20 tortas el mismo sábado. Cuentan los no cancelados de ese día.
export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`ALTER TABLE tiendas
    ADD COLUMN cupo_encargos_dia SMALLINT UNSIGNED NULL AFTER anticipacion_encargo_horas`.execute(
    db,
  );
  await sql`CREATE INDEX ix_pedidos_encargos_dia
    ON pedidos (tienda_id, tipo, fecha_encargo)`.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`DROP INDEX ix_pedidos_encargos_dia ON pedidos`.execute(db);
  await sql`ALTER TABLE tiendas DROP COLUMN cupo_encargos_dia`.execute(db);
}
