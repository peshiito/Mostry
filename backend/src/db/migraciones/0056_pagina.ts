import { type Kysely, sql } from 'kysely';

// "Armá tu página" (P1): la página de inicio de cada tienda como un documento de
// bloques (JSON validado por Zod). Borrador y publicado van separados, así el
// comprador nunca ve una página a medio armar, y se guardan las últimas
// versiones publicadas para poder volver atrás.
export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    CREATE TABLE paginas_tienda (
      tienda_id INT UNSIGNED NOT NULL,
      borrador JSON NULL,
      publicado JSON NULL,
      version INT UNSIGNED NOT NULL DEFAULT 0,
      actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      publicado_en DATETIME NULL,
      PRIMARY KEY (tienda_id),
      CONSTRAINT fk_paginas_tienda FOREIGN KEY (tienda_id) REFERENCES tiendas (id)
    )
  `.execute(db);
  await sql`
    CREATE TABLE versiones_pagina (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      tienda_id INT UNSIGNED NOT NULL,
      documento JSON NOT NULL,
      creada_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uq_versiones_pagina_tienda_id (tienda_id, id),
      CONSTRAINT fk_versiones_pagina_tienda FOREIGN KEY (tienda_id) REFERENCES tiendas (id)
    )
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`DROP TABLE versiones_pagina`.execute(db);
  await sql`DROP TABLE paginas_tienda`.execute(db);
}
