import { type Kysely, sql } from 'kysely';

// Lo único que queda de una tienda eliminada (Mejoras 4): un resumen SIN datos
// personales (ni email, ni teléfono, ni compradores), para los números de Mostry.
export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    CREATE TABLE tiendas_eliminadas (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      nombre VARCHAR(80) NOT NULL,
      slug VARCHAR(40) NOT NULL,
      alta_en DATETIME NOT NULL,
      eliminada_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      total_pagado INT UNSIGNED NOT NULL DEFAULT 0,
      -- [{ monto, fecha, desde, hasta }] de cada pago de suscripción.
      pagos JSON NOT NULL,
      PRIMARY KEY (id),
      KEY ix_tiendas_eliminadas_fecha (eliminada_en)
    )
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`DROP TABLE tiendas_eliminadas`.execute(db);
}
