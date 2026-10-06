import { type Kysely, sql } from 'kysely';

// Avisos de suscripción ya enviados: el job diario puede correr mil veces y
// cada aviso sale una sola vez por período (idempotente, sección 4).
export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    CREATE TABLE avisos_suscripcion (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      tienda_id INT UNSIGNED NOT NULL,
      tipo ENUM('prueba_3_dias', 'prueba_1_dia', 'gracia', 'suspendida') NOT NULL,
      -- Vencimiento al que corresponde el aviso: un plan nuevo habilita avisos nuevos.
      vence DATETIME NOT NULL,
      enviado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uq_avisos (tienda_id, tipo, vence),
      CONSTRAINT fk_avisos_tienda FOREIGN KEY (tienda_id) REFERENCES tiendas (id)
    )
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`DROP TABLE avisos_suscripcion`.execute(db);
}
