import { NO_MIGRATIONS, type MigrationResultSet } from 'kysely/migration';
import { config } from '../../config/env.js';
import { db } from '../../shared/db/db.js';
import { logger } from '../../shared/logger.js';
import { crearMigrador } from '../migrador.js';

// Uso: tsx src/db/cli/migrar.ts <subir | bajar | bajar-todo>
const accion = process.argv[2] ?? 'subir';
const migrador = crearMigrador(db);

async function ejecutar(): Promise<MigrationResultSet> {
  if (accion === 'subir') return migrador.migrateToLatest();
  if (accion === 'bajar') return migrador.migrateDown();
  if (accion === 'bajar-todo') {
    if (config.NODE_ENV === 'production')
      throw new Error('bajar-todo está prohibido en producción');
    return migrador.migrateTo(NO_MIGRATIONS);
  }
  throw new Error(`Acción desconocida: ${accion}`);
}

try {
  const { error, results = [] } = await ejecutar();
  for (const r of results) {
    const marca = r.status === 'Success' ? '✔' : '✘';
    logger.info(`${marca} ${r.direction === 'Up' ? 'subió' : 'bajó'} ${r.migrationName}`);
  }
  if (results.length === 0) logger.info('Nada para hacer.');
  if (error) throw error;
} catch (err) {
  logger.error({ err }, 'Falló la migración');
  process.exitCode = 1;
} finally {
  await db.destroy();
}
