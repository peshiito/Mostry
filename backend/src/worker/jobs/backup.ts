import { PutObjectCommand } from '@aws-sdk/client-s3';
import { gzipSync } from 'node:zlib';
import { config } from '../../config/env.js';
import { s3 } from '../../shared/archivos/clienteS3.js';
import { comandoMysql, ejecutar } from '../../shared/procesos/ejecutar.js';
import { enArgentina } from '../../shared/utils/horaArgentina.js';
import { contarFilas } from './conteoTablas.js';
import { podarBackups, prefijoBackups } from './podarBackups.js';

const TAMANO_MINIMO = 1_000;

const subir = (Key: string, Body: Buffer, ContentType: string) =>
  s3.send(
    new PutObjectCommand({ Bucket: config.S3_BUCKET_BACKUPS, Key, Body, ContentType }),
  );

// Job (diario): mysqldump comprimido al bucket privado de backups (sección 6.6).
// --single-transaction: copia consistente sin trabar la tienda mientras corre.
// Idempotente: correrlo dos veces el mismo día pisa el backup de ese día.
export async function backupBase(ahora = new Date()) {
  const filas = await contarFilas(config.nombreBase);
  const [comando, args] = comandoMysql(config.BACKUP_DUMP_CMD, [
    '--single-transaction',
    '--quick',
    '--routines',
    '--no-tablespaces',
    config.nombreBase,
  ]);
  const crudo = await ejecutar(comando, args);
  // Un dump sano termina con este comentario: si no está, salió cortado.
  if (
    crudo.length < TAMANO_MINIMO ||
    !crudo.subarray(-300).toString('utf8').includes('-- Dump completed')
  ) {
    throw new Error(
      `Backup inválido: ${crudo.length} bytes y sin "-- Dump completed". No se sube ni se poda nada.`,
    );
  }
  const base = `${prefijoBackups()}${enArgentina(ahora).fecha}`;
  const dump = gzipSync(crudo);
  await subir(`${base}.sql.gz`, dump, 'application/gzip');
  await subir(`${base}.json`, Buffer.from(JSON.stringify({ filas })), 'application/json');
  const borrados = await podarBackups(ahora);
  return { clave: `${base}.sql.gz`, bytes: dump.length, borrados };
}
