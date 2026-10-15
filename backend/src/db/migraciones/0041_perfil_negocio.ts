import { type Kysely, sql } from 'kysely';

// Perfil del negocio (Mejoras 3, parte A): qué partes de Mostry usa cada tienda.
// La caja y los productos son la base: siempre están. Las tiendas que ya existen
// quedan con todo prendido y "configuradas", así no ven las preguntas del inicio.
const COLUMNAS = sql`
  ADD COLUMN vende_online BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN usa_encargos BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN usa_libreta BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN usa_gastos BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN rubro VARCHAR(30) NULL,
  ADD COLUMN configurada_en DATETIME NULL`;

export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`ALTER TABLE tiendas ${COLUMNAS}`.execute(db);
  await sql`UPDATE tiendas SET configurada_en = NOW()`.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`ALTER TABLE tiendas
    DROP COLUMN configurada_en, DROP COLUMN rubro, DROP COLUMN usa_gastos,
    DROP COLUMN usa_libreta, DROP COLUMN usa_encargos, DROP COLUMN vende_online`.execute(
    db,
  );
}
