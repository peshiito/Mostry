import { readdirSync } from 'node:fs';
import { sql } from 'kysely';
import { NO_MIGRATIONS } from 'kysely/migration';
import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../shared/db/db.js';
import { limpiarBase } from '../../test/limpiarBase.js';
import { crearMigrador } from '../migrador.js';

// Cuántas migraciones hay (sin número fijo: se suman con cada mejora).
const TOTAL = readdirSync(new URL('../migraciones', import.meta.url)).filter((f) =>
  /^\d{4}_.*\.ts$/.test(f),
).length;

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
    const tablas = await contarTablas(); // las que hay con todas las migraciones
    const migrador = crearMigrador(db);
    const bajada = await migrador.migrateTo(NO_MIGRATIONS);
    expect(bajada.error).toBeUndefined();
    expect(await contarTablas()).toBe(0);

    const subida = await migrador.migrateToLatest();
    expect(subida.error).toBeUndefined();
    expect(subida.results).toHaveLength(TOTAL);
    expect(await contarTablas()).toBe(tablas);
  });

  it('cada migración se puede bajar y volver a subir de a una', async () => {
    const tablas = await contarTablas();
    const migrador = crearMigrador(db);
    for (let i = 0; i < TOTAL; i++)
      expect((await migrador.migrateDown()).error).toBeUndefined();
    for (let i = 0; i < TOTAL; i++)
      expect((await migrador.migrateUp()).error).toBeUndefined();
    expect(await contarTablas()).toBe(tablas);
  });
});
