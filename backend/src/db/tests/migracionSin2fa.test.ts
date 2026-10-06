import { sql } from 'kysely';
import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../shared/db/db.js';
import { limpiarBase } from '../../test/limpiarBase.js';
import { crearMigrador } from '../migrador.js';

// 0032 saca el 2FA: una sesión que había quedado esperando el TOTP no puede
// convertirse en una sesión completa del panel. Tiene que desaparecer.
describe('migración 0032 (sin 2FA)', { timeout: 60_000 }, () => {
  beforeEach(limpiarBase);

  it('borra las sesiones a medio camino y conserva las completas', async () => {
    const migrador = crearMigrador(db);
    expect((await migrador.migrateDown()).error).toBeUndefined();
    try {
      await sql`INSERT INTO usuarios (email, hash_clave, nombre)
        VALUES ('a@test.com', 'x', 'A')`.execute(db);
      const sesion = (estado: string, hash: string) => sql`
        INSERT INTO sesiones (usuario_id, tipo, estado, hash_token, expira_en)
        SELECT id, 'panel', ${estado}, ${hash}, NOW() + INTERVAL 1 DAY
        FROM usuarios WHERE email = 'a@test.com'`;
      await sesion('falta_totp', 'a'.repeat(64)).execute(db);
      await sesion('falta_configurar_totp', 'b'.repeat(64)).execute(db);
      await sesion('completa', 'c'.repeat(64)).execute(db);
    } finally {
      expect((await migrador.migrateUp()).error).toBeUndefined();
    }
    const quedan = await db.selectFrom('sesiones').select('hashToken').execute();
    expect(quedan.map((s) => s.hashToken)).toEqual(['c'.repeat(64)]);
  });
});
