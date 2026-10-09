import { type Kysely, sql } from 'kysely';

// Todo lo que hizo Mostry con un acceso de soporte: el comercio lo ve en su panel.
// FK compuesta (tienda_id, acceso_id): un registro no puede apuntar al acceso de otra tienda.
export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    CREATE TABLE registro_soporte (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      tienda_id INT UNSIGNED NOT NULL,
      acceso_id INT UNSIGNED NOT NULL,
      admin_id INT UNSIGNED NOT NULL,
      accion VARCHAR(200) NOT NULL,
      metodo VARCHAR(10) NOT NULL,
      ruta VARCHAR(200) NOT NULL,
      creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY ix_registro_soporte_tienda (tienda_id, creado_en),
      CONSTRAINT fk_registro_soporte_acceso FOREIGN KEY (tienda_id, acceso_id)
        REFERENCES accesos_soporte (tienda_id, id),
      CONSTRAINT fk_registro_soporte_admin FOREIGN KEY (admin_id) REFERENCES usuarios (id)
    )
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`DROP TABLE registro_soporte`.execute(db);
}
