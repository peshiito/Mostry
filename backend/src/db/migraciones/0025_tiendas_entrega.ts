import { type Kysely, sql } from 'kysely';

// Formas de entrega que ofrece cada tienda.
export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    ALTER TABLE tiendas
      ADD COLUMN acepta_envio BOOLEAN NOT NULL DEFAULT TRUE AFTER costo_envio,
      ADD COLUMN acepta_retiro BOOLEAN NOT NULL DEFAULT TRUE AFTER acepta_envio,
      ADD CONSTRAINT ck_tiendas_entrega CHECK (acepta_envio OR acepta_retiro)
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`
    ALTER TABLE tiendas
      DROP CHECK ck_tiendas_entrega,
      DROP COLUMN acepta_retiro,
      DROP COLUMN acepta_envio
  `.execute(db);
}
