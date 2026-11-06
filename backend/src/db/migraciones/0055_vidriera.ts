import { type Kysely, sql } from 'kysely';

// Vidriera 2.0 (V3 y V4): foto de portada, contenido propio de la vidriera
// ("Sobre nosotros", redes y orden de las secciones, en un JSON validado por Zod)
// y la galería de fotos del local (hasta 8, en el bucket público, en WebP).
export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`ALTER TABLE tiendas
    ADD COLUMN portada_clave VARCHAR(255) NULL AFTER logo_clave,
    ADD COLUMN contenido JSON NULL AFTER tema`.execute(db);
  await sql`
    CREATE TABLE galeria_tienda (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      tienda_id INT UNSIGNED NOT NULL,
      clave VARCHAR(255) NOT NULL,
      orden TINYINT UNSIGNED NOT NULL DEFAULT 0,
      creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uq_galeria_tienda_id (tienda_id, id),
      KEY ix_galeria_tienda_orden (tienda_id, orden),
      CONSTRAINT fk_galeria_tienda FOREIGN KEY (tienda_id) REFERENCES tiendas (id)
    )
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`DROP TABLE galeria_tienda`.execute(db);
  await sql`ALTER TABLE tiendas DROP COLUMN contenido, DROP COLUMN portada_clave`.execute(
    db,
  );
}
