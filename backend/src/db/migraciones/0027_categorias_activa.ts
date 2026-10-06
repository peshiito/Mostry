import { type Kysely, sql } from 'kysely';

// "Nada se borra de verdad" (CLAUDE.md 5): las categorías se desactivan.
export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    ALTER TABLE categorias
      ADD COLUMN activa BOOLEAN NOT NULL DEFAULT TRUE AFTER orden,
      ADD KEY ix_categorias_activas (tienda_id, activa, orden)
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`
    ALTER TABLE categorias
      DROP KEY ix_categorias_activas,
      DROP COLUMN activa
  `.execute(db);
}
