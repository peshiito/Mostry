import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import { config } from '../../config/env.js';
import { borrarClaves } from '../../shared/archivos/borrarClaves.js';
import { s3 } from '../../shared/archivos/clienteS3.js';
import { logger } from '../../shared/logger.js';
import { enArgentina } from '../../shared/utils/horaArgentina.js';

const DIA_MS = 24 * 60 * 60 * 1000;
const DIARIOS = 14;
const MENSUALES = 6;
const FECHA = /(\d{4}-\d{2}-\d{2})\.sql\.gz$/;

// Cada entorno en su carpeta: staging nunca pisa ni poda los backups de producción.
export const prefijoBackups = () => `backups/${config.NODE_ENV}/`;

// Retención (decisión 42): los últimos 14 días + el del día 1 de los últimos 6
// meses. Y SIEMPRE los últimos 14 archivos: si hubo días sin backup, no se borran
// los buenos que quedaban.
export function aConservar(fechas: string[], ahora: Date): Set<string> {
  const limiteDiario = enArgentina(new Date(ahora.getTime() - DIARIOS * DIA_MS)).fecha;
  const ordenadas = [...fechas].sort().reverse();
  const mensuales = ordenadas.filter((f) => f.endsWith('-01')).slice(0, MENSUALES);
  return new Set([
    ...fechas.filter((f) => f > limiteDiario),
    ...ordenadas.slice(0, DIARIOS),
    ...mensuales,
  ]);
}

export async function listarBackups(): Promise<string[]> {
  const r = await s3.send(
    new ListObjectsV2Command({
      Bucket: config.S3_BUCKET_BACKUPS,
      Prefix: prefijoBackups(),
    }),
  );
  return (r.Contents ?? [])
    .map((o) => o.Key!)
    .filter((k) => FECHA.test(k))
    .sort();
}

export async function podarBackups(ahora = new Date()): Promise<number> {
  const claves = await listarBackups();
  const fechaDe = (k: string) => FECHA.exec(k)![1]!;
  const conservar = aConservar(claves.map(fechaDe), ahora);
  const viejas = claves
    .filter((k) => !conservar.has(fechaDe(k)))
    .flatMap((k) => [k, k.replace(/\.sql\.gz$/, '.json')]);
  const fallos = await borrarClaves(viejas, config.S3_BUCKET_BACKUPS);
  if (fallos.length) logger.error({ fallos }, 'No se pudieron borrar backups viejos');
  return (viejas.length - fallos.length) / 2;
}
