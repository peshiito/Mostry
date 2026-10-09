import { sql } from 'kysely';
import { NO_MIGRATIONS } from 'kysely/migration';
import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../shared/db/db.js';
import { limpiarBase } from '../../test/limpiarBase.js';
import { crearMigrador } from '../migrador.js';

async function contarTablas(): Promise<number> {
  const { rows } = await sql<{ n: number }>`
    SELECT COUNT(*) AS n FROM information_schema.tables
    WHERE table_schema = DATABASE() AND table_name NOT LIKE 'kysely_migraciones%'
  `.execute(db);
  return Number(rows[0]?.n);
}

// Bajar y subir todas las migraciones lleva varios segundos: si se cortara a la
// mitad, dejaría la base de test sin tablas y rompería todos los demás tests.
describe('migraciones', { timeout: 120_000 }, () => {
  // Base vacía: datos que dejó otro test (por ejemplo, dos categorías con el mismo
  // nombre, una desactivada) impedirían recrear los índices únicos al subir.
  beforeEach(limpiarBase);

  it('bajan todo y vuelven a subir de cero', async () => {
    const migrador = crearMigrador(db);
    const bajada = await migrador.migrateTo(NO_MIGRATIONS);
    expect(bajada.error).toBeUndefined();
    expect(await contarTablas()).toBe(0);

    const subida = await migrador.migrateToLatest();
    expect(subida.error).toBeUndefined();
    expect(subida.results).toHaveLength(37);
    expect(await contarTablas()).toBe(28);
  });

  it('cada migración se puede bajar y volver a subir de a una', async () => {
    const migrador = crearMigrador(db);
    for (let i = 0; i < 37; i++)
      expect((await migrador.migrateDown()).error).toBeUndefined();
    for (let i = 0; i < 37; i++)
      expect((await migrador.migrateUp()).error).toBeUndefined();
    expect(await contarTablas()).toBe(28);
  });
});
