import { sql } from 'kysely';
import { db } from '../../shared/db/db.js';

// Tablas cuyas filas se cuentan al hacer el backup y se comparan al restaurar:
// así una restauración "con las tablas pero vacías" no pasa por buena.
const CLAVE = [
  'tiendas',
  'usuarios',
  'productos',
  'pedidos',
  'movimientos_caja',
] as const;

export async function contarFilas(base: string): Promise<Record<string, number>> {
  const conteo: Record<string, number> = {};
  for (const tabla of CLAVE) {
    const { rows } = await sql<{
      n: number;
    }>`SELECT COUNT(*) AS n FROM ${sql.table(`${base}.${tabla}`)}`.execute(db);
    conteo[tabla] = Number(rows[0]?.n);
  }
  return conteo;
}

// Las filas se cuentan apenas antes del dump: entre medio pudo entrar algo, así
// que se exige que no FALTE nada (no que sea idéntico).
export function filasFaltantes(
  antes: Record<string, number>,
  despues: Record<string, number>,
): string[] {
  return Object.entries(antes)
    .filter(([tabla, n]) => (despues[tabla] ?? 0) < n)
    .map(([tabla, n]) => `${tabla}: ${despues[tabla] ?? 0} de ${n}`);
}
