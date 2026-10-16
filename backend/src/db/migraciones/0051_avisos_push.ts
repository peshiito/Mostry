import { type Kysely, sql } from 'kysely';

// Avisos 1: notificaciones push al teléfono del comerciante. Cada teléfono que
// activa los avisos deja su suscripción (por tienda y usuario). La cola guarda
// QUÉ avisar (sin textos ni datos personales): se arma al mandar. La clave única
// por tienda evita avisos duplicados. El horario de silencio es de cada miembro.
export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    CREATE TABLE suscripciones_push (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      tienda_id INT UNSIGNED NOT NULL,
      usuario_id INT UNSIGNED NOT NULL,
      endpoint VARCHAR(500) NOT NULL,
      p256dh VARCHAR(120) NOT NULL,
      auth VARCHAR(40) NOT NULL,
      dispositivo VARCHAR(60) NULL,
      fallos TINYINT UNSIGNED NOT NULL DEFAULT 0,
      creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      ultimo_uso_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uq_suscripciones_push_endpoint (endpoint),
      KEY ix_suscripciones_push_miembro (tienda_id, usuario_id),
      CONSTRAINT fk_suscripciones_push_tienda FOREIGN KEY (tienda_id) REFERENCES tiendas (id),
      CONSTRAINT fk_suscripciones_push_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
    )
  `.execute(db);
  await sql`
    CREATE TABLE avisos_push (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      tienda_id INT UNSIGNED NOT NULL,
      tipo ENUM('pedido_nuevo', 'encargo_nuevo', 'comprobante', 'resumen') NOT NULL,
      pedido_id INT UNSIGNED NULL,
      clave VARCHAR(60) NOT NULL,
      creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      reclamado_en DATETIME NULL,
      enviado_en DATETIME NULL,
      intentos TINYINT UNSIGNED NOT NULL DEFAULT 0,
      PRIMARY KEY (id),
      UNIQUE KEY uq_avisos_push_clave (tienda_id, clave),
      KEY ix_avisos_push_pendientes (enviado_en, creado_en),
      CONSTRAINT fk_avisos_push_tienda FOREIGN KEY (tienda_id) REFERENCES tiendas (id),
      CONSTRAINT fk_avisos_push_pedido FOREIGN KEY (tienda_id, pedido_id)
        REFERENCES pedidos (tienda_id, id)
    )
  `.execute(db);
  await sql`ALTER TABLE miembros_tienda
    ADD COLUMN silencio_desde TIME NULL, ADD COLUMN silencio_hasta TIME NULL`.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`ALTER TABLE miembros_tienda DROP COLUMN silencio_hasta, DROP COLUMN silencio_desde`.execute(
    db,
  );
  await sql`DROP TABLE avisos_push`.execute(db);
  await sql`DROP TABLE suscripciones_push`.execute(db);
}
