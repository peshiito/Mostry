import { type Kysely, sql } from 'kysely';

// Club Mostry (Lealtad L1): códigos por email del cliente (verificar y recuperar)
// y el código corto del QR, que rota cada 5 minutos.
export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    CREATE TABLE codigos_email_club (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      cliente_id INT UNSIGNED NOT NULL,
      proposito ENUM('verificar_email', 'recuperar_clave') NOT NULL,
      hash_codigo CHAR(64) NOT NULL,
      intentos TINYINT UNSIGNED NOT NULL DEFAULT 0,
      expira_en DATETIME NOT NULL,
      usado_en DATETIME NULL,
      creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY ix_codigos_email_club (cliente_id, proposito, expira_en),
      CONSTRAINT fk_codigos_email_club FOREIGN KEY (cliente_id) REFERENCES clientes (id),
      CONSTRAINT ck_codigos_email_club_intentos CHECK (intentos <= 5)
    )
  `.execute(db);
  // El código corto del QR: rota cada 5 minutos y se guarda como HMAC.
  await sql`
    CREATE TABLE codigos_club (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      cliente_id INT UNSIGNED NOT NULL,
      hash_codigo CHAR(64) NOT NULL,
      expira_en DATETIME NOT NULL,
      creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uq_codigos_club_hash (hash_codigo),
      KEY ix_codigos_club_cliente (cliente_id, expira_en),
      KEY ix_codigos_club_expira (expira_en),
      CONSTRAINT fk_codigos_club_cliente FOREIGN KEY (cliente_id) REFERENCES clientes (id)
    )
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`DROP TABLE codigos_club`.execute(db);
  await sql`DROP TABLE codigos_email_club`.execute(db);
}
