import { execSync } from 'node:child_process';
import { ENV_API } from './entorno.js';

// Corre una tarea del worker de verdad (npm run worker:correr) contra la base e2e.
export function correrTarea(nombre) {
  execSync(`npm run worker:correr -- ${nombre}`, {
    cwd: new URL('../../backend', import.meta.url),
    env: { ...process.env, ...ENV_API },
    stdio: 'pipe',
  });
}

// Deja la prueba gratis de `slug` venciendo dentro de `dias` (negativo: ya venció)
// y corre la tarea diaria de suscripciones, como en producción.
export async function vencerPrueba(sql, slug, dias) {
  await sql(
    `UPDATE tiendas SET estado = 'prueba', plan_hasta = NULL, suspendida_manual = 0,
       prueba_hasta = DATE_ADD(UTC_TIMESTAMP(), INTERVAL ? DAY) WHERE slug = ?`,
    [dias, slug],
  );
  correrTarea('suscripciones');
}
