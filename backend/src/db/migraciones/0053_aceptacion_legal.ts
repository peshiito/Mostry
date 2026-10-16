import { type Kysely, sql } from 'kysely';

// S2: constancia de qué versión de los términos y la privacidad aceptó cada
// dueño de tienda (y cada cliente del Club). NULL = nunca aceptó una versión
// guardada (cuentas anteriores a la S2): el panel se lo pide al entrar.
export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`ALTER TABLE usuarios
    ADD COLUMN terminos_version VARCHAR(10) NULL,
    ADD COLUMN terminos_aceptados_en DATETIME NULL`.execute(db);
  await sql`ALTER TABLE clientes
    ADD COLUMN terminos_version VARCHAR(10) NULL AFTER acepto_terminos_en`.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`ALTER TABLE clientes DROP COLUMN terminos_version`.execute(db);
  await sql`ALTER TABLE usuarios
    DROP COLUMN terminos_version,
    DROP COLUMN terminos_aceptados_en`.execute(db);
}
