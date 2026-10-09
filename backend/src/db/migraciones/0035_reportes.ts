import { type Kysely, sql } from 'kysely';

// Reportes de problemas que el comercio le manda a Mostry desde su panel. La
// captura (opcional) vive en el bucket privado y se borra al resolverse.
export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    CREATE TABLE reportes (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      tienda_id INT UNSIGNED NOT NULL,
      numero INT UNSIGNED NOT NULL,
      usuario_id INT UNSIGNED NOT NULL,
      pantalla VARCHAR(40) NOT NULL,
      descripcion VARCHAR(2000) NOT NULL,
      clave_captura VARCHAR(200) NULL,
      navegador VARCHAR(255) NULL,
      estado ENUM('nuevo', 'en_curso', 'resuelto') NOT NULL DEFAULT 'nuevo',
      respuesta VARCHAR(1000) NULL,
      creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uq_reportes_tienda_id (tienda_id, id),
      UNIQUE KEY uq_reportes_numero (tienda_id, numero),
      KEY ix_reportes_estado (estado, creado_en),
      CONSTRAINT fk_reportes_tienda FOREIGN KEY (tienda_id) REFERENCES tiendas (id),
      CONSTRAINT fk_reportes_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id),
      CONSTRAINT ck_reportes_descripcion CHECK (CHAR_LENGTH(descripcion) >= 10)
    )
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`DROP TABLE reportes`.execute(db);
}
