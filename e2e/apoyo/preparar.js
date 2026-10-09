import { execSync } from 'node:child_process';
import { sql } from './base.js';
import { ENV_API } from './entorno.js';

// Antes de cada corrida: base e2e de cero (migraciones + seed) y tiendas abiertas
// todo el día, así los recorridos no dependen de la hora en que se corren.
export default async function preparar() {
  const npm = (script) =>
    execSync(`npm run ${script}`, {
      cwd: new URL('../../backend', import.meta.url),
      env: { ...process.env, ...ENV_API },
      stdio: 'pipe',
    });
  npm('db:bajar-todo');
  npm('db:migrar');
  npm('db:seed');
  await sql('DELETE FROM horarios');
  await sql(
    `INSERT INTO horarios (tienda_id, dia_semana, abre, cierra)
     SELECT t.id, d.n, '00:00', '24:00' FROM tiendas t
     CROSS JOIN (SELECT 0 n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3
                 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6) d`,
  );
  await sql('DELETE FROM feriados');
}
