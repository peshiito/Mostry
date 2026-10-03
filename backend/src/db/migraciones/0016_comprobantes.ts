import { type Kysely, sql } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    CREATE TABLE comprobantes (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      tienda_id INT UNSIGNED NOT NULL,
      pedido_id INT UNSIGNED NOT NULL,
      tipo ENUM('pago', 'sena') NOT NULL,
      -- Clave en el bucket privado; queda NULL cuando el worker borra el archivo.
      archivo_clave VARCHAR(255) NULL,
      archivo_tipo ENUM('jpg', 'png', 'pdf') NOT NULL,
      estado ENUM('pendiente', 'aprobado', 'rechazado') NOT NULL DEFAULT 'pendiente',
      monto INT UNSIGNED NULL,
      fecha_operacion DATETIME NULL,
      titular VARCHAR(100) NULL,
      numero_operacion VARCHAR(60) NULL,
      motivo_rechazo VARCHAR(200) NULL,
      revisado_por INT UNSIGNED NULL,
      aprobado_en DATETIME NULL,
      rechazado_en DATETIME NULL,
      archivo_borrar_en DATETIME NULL,
      archivo_borrado_en DATETIME NULL,
      creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      -- (tienda_id, id) permite FK compuestas: imposible apuntar a otra tienda.
      UNIQUE KEY uq_comprobantes_tienda (tienda_id, id),
      CONSTRAINT fk_comprobantes_tienda FOREIGN KEY (tienda_id) REFERENCES tiendas (id),
      KEY ix_comprobantes_pedido (tienda_id, pedido_id),
      KEY ix_comprobantes_borrar (archivo_borrado_en, archivo_borrar_en),
      CONSTRAINT fk_comprobantes_pedido FOREIGN KEY (tienda_id, pedido_id)
        REFERENCES pedidos (tienda_id, id),
      CONSTRAINT fk_comprobantes_revisor FOREIGN KEY (revisado_por) REFERENCES usuarios (id),
      CONSTRAINT ck_comprobantes_rechazo CHECK (estado <> 'rechazado' OR motivo_rechazo IS NOT NULL)
    )
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`DROP TABLE comprobantes`.execute(db);
}
