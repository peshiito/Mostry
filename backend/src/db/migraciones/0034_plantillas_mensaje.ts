import { type Kysely, sql } from 'kysely';

// Textos de WhatsApp que el admin edita (vencimiento, encuesta…). Es de la
// plataforma, no de una tienda: sin tienda_id. Solo guarda los que se editaron;
// los textos de base viven en el código (modules/admin/plantillas/plantillasBase.ts).
export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    CREATE TABLE plantillas_mensaje (
      clave VARCHAR(30) NOT NULL,
      texto VARCHAR(1000) NOT NULL,
      actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (clave),
      CONSTRAINT ck_plantillas_texto CHECK (CHAR_LENGTH(texto) > 0)
    )
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`DROP TABLE plantillas_mensaje`.execute(db);
}
