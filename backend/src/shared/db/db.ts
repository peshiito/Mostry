import { CamelCasePlugin, Kysely, MysqlDialect, sql } from 'kysely';
import { crearPool } from './crearPool.js';
import type { Database } from './tipos/index.js';

// En TS se escribe tiendaId; en MySQL queda tienda_id.
// El pool no se conecta hasta la primera consulta.
export const db = new Kysely<Database>({
  dialect: new MysqlDialect({ pool: crearPool() }),
  plugins: [new CamelCasePlugin()],
});

export async function pingDb(): Promise<void> {
  await sql`SELECT 1`.execute(db);
}
