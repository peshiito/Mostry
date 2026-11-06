import { type Kysely, sql } from 'kysely';

// "Armá tu página" (P3): la biblioteca de imágenes de cada tienda para sus
// bloques (portada con carrusel, banners). Fotos en WebP de 1600 y 800 px; GIF
// convertidos a WebP animado. `clave` es la base: los archivos son base-<lado>.webp.
export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    CREATE TABLE medios_tienda (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      tienda_id INT UNSIGNED NOT NULL,
      clave VARCHAR(255) NOT NULL,
      tipo ENUM('foto', 'animado') NOT NULL,
      ancho SMALLINT UNSIGNED NOT NULL,
      alto SMALLINT UNSIGNED NOT NULL,
      bytes INT UNSIGNED NOT NULL,
      creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uq_medios_tienda_id (tienda_id, id),
      CONSTRAINT fk_medios_tienda FOREIGN KEY (tienda_id) REFERENCES tiendas (id)
    )
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`DROP TABLE medios_tienda`.execute(db);
}
