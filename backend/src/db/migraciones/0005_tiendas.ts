import { type Kysely, sql } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    CREATE TABLE tiendas (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      slug VARCHAR(30) NOT NULL,
      nombre VARCHAR(80) NOT NULL,
      frase VARCHAR(160) NULL,
      logo_clave VARCHAR(255) NULL,
      -- Paleta elegida de una lista cerrada (sin colores libres en v1).
      paleta VARCHAR(30) NOT NULL DEFAULT 'toldo',
      alias VARCHAR(50) NULL,
      titular_alias VARCHAR(100) NULL,
      whatsapp VARCHAR(15) NULL,
      direccion VARCHAR(200) NULL,
      estado ENUM('prueba', 'activa', 'gracia', 'suspendida') NOT NULL DEFAULT 'prueba',
      prueba_hasta DATETIME NULL,
      plan_hasta DATETIME NULL,
      pausada BOOLEAN NOT NULL DEFAULT FALSE,
      plazo_comprobante_horas TINYINT UNSIGNED NOT NULL DEFAULT 2,
      plazo_sena_horas TINYINT UNSIGNED NOT NULL DEFAULT 24,
      anticipacion_encargo_horas SMALLINT UNSIGNED NOT NULL DEFAULT 24,
      sena_porcentaje TINYINT UNSIGNED NOT NULL DEFAULT 0,
      costo_envio INT UNSIGNED NOT NULL DEFAULT 0,
      zona_envio VARCHAR(120) NULL,
      ultimo_numero_pedido INT UNSIGNED NOT NULL DEFAULT 0,
      creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uq_tiendas_slug (slug),
      KEY ix_tiendas_estado (estado, plan_hasta),
      CONSTRAINT ck_tiendas_slug CHECK (REGEXP_LIKE(slug, '^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$', 'c')),
      CONSTRAINT ck_tiendas_sena CHECK (sena_porcentaje <= 100),
      CONSTRAINT ck_tiendas_plazos CHECK (plazo_comprobante_horas BETWEEN 1 AND 72
        AND plazo_sena_horas BETWEEN 1 AND 168)
    )
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`DROP TABLE tiendas`.execute(db);
}
