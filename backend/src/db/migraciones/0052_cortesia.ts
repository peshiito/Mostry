import { type Kysely, sql } from 'kysely';

// S1: días de cortesía. El admin le regala días a una tienda (por ejemplo, si
// no pudo usar Mostry por un problema nuestro). Queda como una fila más de
// pagos_suscripcion, con monto 0, el período que agrega y el motivo en `nota`,
// así el comercio la ve junto a sus pagos. Las métricas cuentan solo los pagos.
export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`ALTER TABLE pagos_suscripcion
    ADD COLUMN tipo ENUM('pago', 'cortesia') NOT NULL DEFAULT 'pago' AFTER tienda_id`.execute(
    db,
  );
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`DELETE FROM pagos_suscripcion WHERE tipo = 'cortesia'`.execute(db);
  await sql`ALTER TABLE pagos_suscripcion DROP COLUMN tipo`.execute(db);
}
