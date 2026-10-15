import { type Kysely, sql } from 'kysely';

// Club Mostry (Lealtad L2): el programa de lealtad de cada tienda. Un solo
// interruptor (tiendas.usa_club), como los demás módulos; apagado por defecto.
// Los escalones se ordenan por `compras` (único por tienda).
export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`ALTER TABLE tiendas ADD COLUMN usa_club BOOLEAN NOT NULL DEFAULT FALSE`.execute(
    db,
  );
  await sql`
    CREATE TABLE programas_lealtad (
      tienda_id INT UNSIGNED NOT NULL,
      nombre VARCHAR(40) NOT NULL,
      compra_minima INT UNSIGNED NOT NULL DEFAULT 0,
      vence_meses TINYINT UNSIGNED NULL,
      actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (tienda_id),
      CONSTRAINT fk_programas_lealtad_tienda FOREIGN KEY (tienda_id) REFERENCES tiendas (id)
    )
  `.execute(db);
  await sql`
    CREATE TABLE premios_lealtad (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      tienda_id INT UNSIGNED NOT NULL,
      compras TINYINT UNSIGNED NOT NULL,
      tipo ENUM('porcentaje', 'monto', 'regalo') NOT NULL,
      valor INT UNSIGNED NULL,
      tope INT UNSIGNED NULL,
      descripcion VARCHAR(80) NULL,
      PRIMARY KEY (id),
      UNIQUE KEY uq_premios_lealtad_tienda (tienda_id, id),
      UNIQUE KEY uq_premios_lealtad_compras (tienda_id, compras),
      CONSTRAINT fk_premios_lealtad_programa FOREIGN KEY (tienda_id)
        REFERENCES programas_lealtad (tienda_id),
      CONSTRAINT ck_premios_lealtad_valor CHECK (
        (tipo = 'regalo' AND valor IS NULL AND tope IS NULL AND descripcion IS NOT NULL)
        OR (tipo = 'porcentaje' AND valor BETWEEN 1 AND 100)
        OR (tipo = 'monto' AND valor > 0 AND tope IS NULL)
      )
    )
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`DROP TABLE premios_lealtad`.execute(db);
  await sql`DROP TABLE programas_lealtad`.execute(db);
  await sql`ALTER TABLE tiendas DROP COLUMN usa_club`.execute(db);
}
