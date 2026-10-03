import { type Kysely, sql } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    CREATE TABLE pedidos (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      tienda_id INT UNSIGNED NOT NULL,
      numero INT UNSIGNED NOT NULL,
      -- 256 bits aleatorios en base64url. Va en el link de WhatsApp, por eso en claro.
      token_seguimiento CHAR(43) NOT NULL,
      tipo ENUM('inmediato', 'encargo') NOT NULL,
      estado ENUM('pendiente_pago', 'comprobante_enviado', 'pago_aprobado',
        'pendiente_confirmacion', 'confirmado', 'en_preparacion', 'en_camino',
        'listo_retirar', 'entregado', 'cancelado') NOT NULL,
      cliente_nombre VARCHAR(100) NOT NULL,
      cliente_whatsapp VARCHAR(15) NOT NULL,
      entrega ENUM('envio', 'retiro') NOT NULL,
      direccion VARCHAR(200) NULL,
      link_maps VARCHAR(500) NULL,
      fecha_encargo DATETIME NULL,
      subtotal INT UNSIGNED NOT NULL,
      costo_envio INT UNSIGNED NOT NULL DEFAULT 0,
      total INT UNSIGNED NOT NULL,
      sena INT UNSIGNED NOT NULL DEFAULT 0,
      vence_comprobante_en DATETIME NULL,
      rechazos TINYINT UNSIGNED NOT NULL DEFAULT 0,
      motivo_cancelacion VARCHAR(200) NULL,
      cancelado_en DATETIME NULL,
      entregado_en DATETIME NULL,
      creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      -- (tienda_id, id) permite FK compuestas: imposible apuntar a otra tienda.
      UNIQUE KEY uq_pedidos_tienda (tienda_id, id),
      CONSTRAINT fk_pedidos_tienda FOREIGN KEY (tienda_id) REFERENCES tiendas (id),
      UNIQUE KEY uq_pedidos_numero (tienda_id, numero),
      UNIQUE KEY uq_pedidos_token (token_seguimiento),
      KEY ix_pedidos_lista (tienda_id, estado, creado_en),
      KEY ix_pedidos_vencidos (estado, vence_comprobante_en),
      KEY ix_pedidos_encargos (tienda_id, tipo, fecha_encargo),
      CONSTRAINT ck_pedidos_total CHECK (total = subtotal + costo_envio),
      CONSTRAINT ck_pedidos_sena CHECK (sena <= total),
      CONSTRAINT ck_pedidos_direccion CHECK (entrega = 'retiro' OR direccion IS NOT NULL),
      CONSTRAINT ck_pedidos_encargo CHECK (tipo = 'inmediato' OR fecha_encargo IS NOT NULL),
      CONSTRAINT ck_pedidos_rechazos CHECK (rechazos <= 2)
    )
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`DROP TABLE pedidos`.execute(db);
}
