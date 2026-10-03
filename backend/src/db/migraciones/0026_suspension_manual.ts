import { type Kysely, sql } from 'kysely';

// Suspensión decidida por el admin: pisa el estado calculado por fechas.
export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    ALTER TABLE tiendas
      ADD COLUMN suspendida_manual BOOLEAN NOT NULL DEFAULT FALSE AFTER plan_hasta,
      ADD COLUMN motivo_suspension VARCHAR(200) NULL AFTER suspendida_manual,
      ADD CONSTRAINT ck_tiendas_suspension CHECK (NOT suspendida_manual OR motivo_suspension IS NOT NULL)
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`
    ALTER TABLE tiendas
      DROP CHECK ck_tiendas_suspension,
      DROP COLUMN motivo_suspension,
      DROP COLUMN suspendida_manual
  `.execute(db);
}
