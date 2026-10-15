import { type Kysely, sql } from 'kysely';

// Club Mostry (Lealtad L1): el cliente con cuenta es un tercer tipo de usuario,
// en tablas propias para que nunca se mezcle con comerciantes ni con el admin.
// Ninguna tiene tienda_id: la cuenta es una sola para todas las tiendas.
export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    CREATE TABLE clientes (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      email VARCHAR(254) NOT NULL,
      hash_clave VARCHAR(255) NOT NULL,
      nombre VARCHAR(100) NOT NULL,
      whatsapp VARCHAR(30) NOT NULL,
      direccion VARCHAR(200) NULL,
      email_verificado_en DATETIME NULL,
      acepto_terminos_en DATETIME NOT NULL,
      activo BOOLEAN NOT NULL DEFAULT TRUE,
      creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uq_clientes_email (email)
    )
  `.execute(db);
  await sql`
    CREATE TABLE sesiones_club (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      cliente_id INT UNSIGNED NOT NULL,
      hash_token CHAR(64) NOT NULL,
      expira_en DATETIME NOT NULL,
      ip VARCHAR(45) NULL,
      user_agent VARCHAR(255) NULL,
      ultimo_uso_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uq_sesiones_club_token (hash_token),
      KEY ix_sesiones_club_cliente (cliente_id),
      KEY ix_sesiones_club_expira (expira_en),
      CONSTRAINT fk_sesiones_club_cliente FOREIGN KEY (cliente_id) REFERENCES clientes (id)
    )
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  for (const tabla of ['sesiones_club', 'clientes'])
    await sql`DROP TABLE ${sql.table(tabla)}`.execute(db);
}
