import { sql } from 'kysely';
import { NO_MIGRATIONS } from 'kysely/migration';
import { describe, expect, it } from 'vitest';
import { db } from '../../shared/db/db.js';
import { crearMigrador } from '../migrador.js';

async function contarTablas(): Promise<number> {
  const { rows } = await sql<{ n: number }>`
    SELECT COUNT(*) AS n FROM information_schema.tables
    WHERE table_schema = DATABASE() AND table_name NOT LIKE 'kysely_migraciones%'
  `.execute(db);
  return Number(rows[0]?.n);
}

describe('migraciones', () => {
  it('bajan todo y vuelven a subir de cero', async () => {
    const migrador = crearMigrador(db);
    const bajada = await migrador.migrateTo(NO_MIGRATIONS);
    expect(bajada.error).toBeUndefined();
    expect(await contarTablas()).toBe(0);

    const subida = await migrador.migrateToLatest();
    expect(subida.error).toBeUndefined();
    expect(subida.results).toHaveLength(23);
    expect(await contarTablas()).toBe(23);
  });

  it('cada migración se puede bajar y volver a subir de a una', async () => {
    const migrador = crearMigrador(db);
    for (let i = 0; i < 23; i++)
      expect((await migrador.migrateDown()).error).toBeUndefined();
    for (let i = 0; i < 23; i++)
      expect((await migrador.migrateUp()).error).toBeUndefined();
    expect(await contarTablas()).toBe(23);
  });
});
