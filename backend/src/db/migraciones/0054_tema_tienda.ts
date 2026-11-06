import { type Kysely, sql } from 'kysely';

// Vidriera 2.0 (V1): el diseño de cada tienda (colores libres, tipografías,
// forma, encabezado, fondo y plantilla) en un JSON validado por Zod. NULL = la
// tienda sigue con su paleta de antes, que el frontend traduce a un tema.
export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`ALTER TABLE tiendas ADD COLUMN tema JSON NULL AFTER paleta`.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`ALTER TABLE tiendas DROP COLUMN tema`.execute(db);
}
