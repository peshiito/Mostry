import { spawn } from 'node:child_process';
import { config } from '../../config/env.js';

const TIMEOUT_MS = 30 * 60 * 1000;

// Arma el comando de mysql/mysqldump a partir de la plantilla del .env.
export function comandoMysql(plantilla: string, args: string[]): [string, string[]] {
  const partes = plantilla
    .replaceAll('{host}', config.DB_HOST)
    .replaceAll('{puerto}', String(config.DB_PUERTO))
    .split(/\s+/)
    .filter(Boolean);
  return [partes[0]!, [...partes.slice(1), '-u', config.DB_USUARIO, ...args]];
}

// Corre un comando y devuelve su salida. La clave de la base va por MYSQL_PWD
// (nunca como argumento: se vería en la lista de procesos).
export function ejecutar(
  comando: string,
  args: string[],
  entrada?: Buffer,
): Promise<Buffer> {
  return new Promise((resolver, rechazar) => {
    // timeout: si se cuelga (lock de metadatos, contenedor trabado), se mata.
    const hijo = spawn(comando, args, {
      env: { ...process.env, MYSQL_PWD: config.DB_CLAVE },
      timeout: TIMEOUT_MS,
      killSignal: 'SIGKILL',
    });
    const salida: Buffer[] = [];
    let errores = '';
    hijo.stdout.on('data', (d: Buffer) => salida.push(d));
    hijo.stderr.on('data', (d: Buffer) => (errores += d.toString()));
    // Si el hijo cierra antes de leer todo (EPIPE), lo decide el código de salida.
    hijo.stdin.on('error', (e) => (errores += `\n${e.message}`));
    hijo.on('error', rechazar);
    hijo.on('close', (codigo) => {
      if (codigo === 0) resolver(Buffer.concat(salida));
      else
        rechazar(
          new Error(`${comando} terminó con código ${codigo}: ${errores.slice(-500)}`),
        );
    });
    if (entrada) hijo.stdin.end(entrada);
    else hijo.stdin.end();
  });
}
