import { GetObjectCommand } from '@aws-sdk/client-s3';
import { gunzipSync } from 'node:zlib';
import { config } from '../../config/env.js';
import { s3 } from '../../shared/archivos/clienteS3.js';
import { logger } from '../../shared/logger.js';
import { comandoMysql, ejecutar } from '../../shared/procesos/ejecutar.js';
import { contarFilas, filasFaltantes } from './conteoTablas.js';
import { listarBackups } from './podarBackups.js';

const BASE_PRUEBA = 'mostry_restore_prueba';

const leer = async (Key: string) => {
  const objeto = await s3.send(
    new GetObjectCommand({ Bucket: config.S3_BUCKET_BACKUPS, Key }),
  );
  return Buffer.from(await objeto.Body!.transformToByteArray());
};

// Job (mensual): un backup que nunca se probó no es un backup. Restaura el
// último en una base temporal, compara las filas de las tablas clave y la borra.
// (En producción conviene una instancia o un usuario aparte: ver Etapa 16.)
export async function probarRestauracion() {
  const ultimo = (await listarBackups()).at(-1);
  if (!ultimo) throw new Error('No hay ningún backup para probar');
  const dump = gunzipSync(await leer(ultimo));
  const { filas } = JSON.parse(
    (await leer(ultimo.replace(/\.sql\.gz$/, '.json'))).toString(),
  ) as { filas: Record<string, number> };

  const mysql = (args: string[], entrada?: Buffer) =>
    ejecutar(...comandoMysql(config.BACKUP_MYSQL_CMD, args), entrada);
  await mysql([
    '-e',
    `DROP DATABASE IF EXISTS ${BASE_PRUEBA}; CREATE DATABASE ${BASE_PRUEBA};`,
  ]);
  try {
    await mysql([BASE_PRUEBA], dump);
    const faltan = filasFaltantes(filas, await contarFilas(BASE_PRUEBA));
    if (faltan.length) throw new Error(`Restauración incompleta: ${faltan.join(', ')}`);
    return { backup: ultimo, filas, ok: true };
  } finally {
    // Si falla el DROP, se loguea aparte: no tapa el error real de la prueba.
    await mysql(['-e', `DROP DATABASE IF EXISTS ${BASE_PRUEBA};`]).catch((err: unknown) =>
      logger.error({ err }, 'No se pudo borrar la base de prueba de restauración'),
    );
  }
}
