import { type Kysely, sql } from 'kysely';

// Sesión en dos pasos (clave → TOTP) y protección contra reusar un código TOTP.
export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`
    ALTER TABLE sesiones
      ADD COLUMN estado ENUM('falta_totp', 'falta_configurar_totp', 'completa')
        NOT NULL DEFAULT 'falta_totp' AFTER tipo
  `.execute(db);
  await sql`
    ALTER TABLE usuarios
      -- Último paso de 30 s usado: un código TOTP sirve una sola vez.
      ADD COLUMN totp_ultimo_paso INT UNSIGNED NULL AFTER totp_activado_en
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`ALTER TABLE usuarios DROP COLUMN totp_ultimo_paso`.execute(db);
  await sql`ALTER TABLE sesiones DROP COLUMN estado`.execute(db);
}
