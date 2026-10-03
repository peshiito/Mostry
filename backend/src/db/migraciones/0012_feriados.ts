import { type Kysely, sql } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    CREATE TABLE feriados (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      tienda_id INT UNSIGNED NOT NULL,
      fecha DATE NOT NULL,
      motivo VARCHAR(100) NULL,
      creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      -- (tienda_id, id) permite FK compuestas: imposible apuntar a otra tienda.
      UNIQUE KEY uq_feriados_tienda (tienda_id, id),
      CONSTRAINT fk_feriados_tienda FOREIGN KEY (tienda_id) REFERENCES tiendas (id),
      UNIQUE KEY uq_feriados_fecha (tienda_id, fecha)
    )
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`DROP TABLE feriados`.execute(db);
}
