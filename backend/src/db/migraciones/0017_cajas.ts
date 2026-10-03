import { type Kysely, sql } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    CREATE TABLE cajas (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      tienda_id INT UNSIGNED NOT NULL,
      -- Día de la caja en hora argentina.
      fecha DATE NOT NULL,
      monto_apertura INT UNSIGNED NOT NULL,
      abierta_en DATETIME NOT NULL,
      cerrada_en DATETIME NULL,
      monto_contado INT UNSIGNED NULL,
      -- contado − (apertura + ingresos efectivo − egresos efectivo − depósitos)
      diferencia INT NULL,
      creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      -- (tienda_id, id) permite FK compuestas: imposible apuntar a otra tienda.
      UNIQUE KEY uq_cajas_tienda (tienda_id, id),
      CONSTRAINT fk_cajas_tienda FOREIGN KEY (tienda_id) REFERENCES tiendas (id),
      UNIQUE KEY uq_cajas_fecha (tienda_id, fecha)
    )
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`DROP TABLE cajas`.execute(db);
}
