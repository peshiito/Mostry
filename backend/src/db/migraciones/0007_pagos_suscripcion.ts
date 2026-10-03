import { type Kysely, sql } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    CREATE TABLE pagos_suscripcion (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      tienda_id INT UNSIGNED NOT NULL,
      monto INT UNSIGNED NOT NULL,
      pagado_en DATE NOT NULL,
      periodo_desde DATETIME NOT NULL,
      periodo_hasta DATETIME NOT NULL,
      registrado_por INT UNSIGNED NOT NULL,
      nota VARCHAR(200) NULL,
      creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY ix_pagos_tienda (tienda_id, periodo_hasta),
      CONSTRAINT fk_pagos_tienda FOREIGN KEY (tienda_id) REFERENCES tiendas (id),
      CONSTRAINT fk_pagos_admin FOREIGN KEY (registrado_por) REFERENCES usuarios (id),
      CONSTRAINT ck_pagos_periodo CHECK (periodo_desde < periodo_hasta)
    )
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`DROP TABLE pagos_suscripcion`.execute(db);
}
