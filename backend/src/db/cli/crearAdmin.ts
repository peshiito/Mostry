import { createInterface } from 'node:readline/promises';
import { crearAdmin } from '../../modules/admin/cuenta/crearAdmin.js';
import { db } from '../../shared/db/db.js';
import { logger } from '../../shared/logger.js';

// Uso: npm run admin:crear -- <email> "<nombre>"
// La contraseña se pide por teclado (no queda en el historial de la terminal) o,
// para correrlo sin teclado (por ejemplo en Railway), por la variable ADMIN_CLAVE.
async function pedirClave(): Promise<string> {
  if (process.env.ADMIN_CLAVE) return process.env.ADMIN_CLAVE;
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });
  const escribir = (rl as unknown as { _writeToOutput: (s: string) => void })
    ._writeToOutput;
  (rl as unknown as { _writeToOutput: (s: string) => void })._writeToOutput = (s) =>
    escribir.call(rl, s.includes('Contraseña') ? s : '');
  const clave = await rl.question('Contraseña del admin (no se ve al escribir): ');
  rl.close();
  process.stdout.write('\n');
  return clave;
}

const [email, nombre = 'Admin Mostry'] = process.argv.slice(2);
try {
  if (!email)
    throw new Error('Falta el email: npm run admin:crear -- <email> "<nombre>"');
  logger.info(
    `✔ Admin creado: ${await crearAdmin({ email, nombre, clave: await pedirClave() })}`,
  );
} catch (err) {
  logger.error({ err }, 'No se pudo crear el admin');
  process.exitCode = 1;
} finally {
  await db.destroy();
}
