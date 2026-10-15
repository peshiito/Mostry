import { type Kysely, sql } from 'kysely';

// Ayuda del admin (Mejoras 4): clave temporal que obliga a elegir una nueva, y
// constancia de cada ayuda o eliminación. `registro_admin` no tiene FK a tiendas
// a propósito: tiene que sobrevivir a que la tienda se elimine.
export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`ALTER TABLE usuarios
    ADD COLUMN debe_cambiar_clave BOOLEAN NOT NULL DEFAULT FALSE`.execute(db);
  await sql`
    CREATE TABLE registro_admin (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      admin_id INT UNSIGNED NOT NULL,
      tienda_id INT UNSIGNED NULL,
      tienda_slug VARCHAR(40) NOT NULL,
      accion VARCHAR(40) NOT NULL,
      detalle VARCHAR(255) NULL,
      creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY ix_registro_admin_tienda (tienda_id, creado_en),
      CONSTRAINT fk_registro_admin_admin FOREIGN KEY (admin_id) REFERENCES usuarios (id)
    )
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`DROP TABLE registro_admin`.execute(db);
  await sql`ALTER TABLE usuarios DROP COLUMN debe_cambiar_clave`.execute(db);
}
