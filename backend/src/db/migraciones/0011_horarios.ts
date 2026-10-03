import { type Kysely, sql } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    CREATE TABLE horarios (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      tienda_id INT UNSIGNED NOT NULL,
      -- 0 = domingo … 6 = sábado. Varios tramos por día; sin cruzar la medianoche.
      dia_semana TINYINT UNSIGNED NOT NULL,
      abre TIME NOT NULL,
      cierra TIME NOT NULL,
      creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      -- (tienda_id, id) permite FK compuestas: imposible apuntar a otra tienda.
      UNIQUE KEY uq_horarios_tienda (tienda_id, id),
      CONSTRAINT fk_horarios_tienda FOREIGN KEY (tienda_id) REFERENCES tiendas (id),
      KEY ix_horarios_dia (tienda_id, dia_semana),
      CONSTRAINT ck_horarios_dia CHECK (dia_semana <= 6),
      CONSTRAINT ck_horarios_tramo CHECK (abre < cierra)
    )
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`DROP TABLE horarios`.execute(db);
}
