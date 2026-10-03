import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Kysely } from 'kysely';
import { FileMigrationProvider, Migrator } from 'kysely/migration';

const carpeta = fileURLToPath(new URL('./migraciones', import.meta.url));

// Las migraciones usan SQL puro, así que no dependen del CamelCasePlugin.
export function crearMigrador<T>(db: Kysely<T>): Migrator {
  return new Migrator({
    db: db.withoutPlugins(),
    provider: new FileMigrationProvider({ fs, path, migrationFolder: carpeta }),
    migrationTableName: 'kysely_migraciones',
    migrationLockTableName: 'kysely_migraciones_lock',
  });
}
