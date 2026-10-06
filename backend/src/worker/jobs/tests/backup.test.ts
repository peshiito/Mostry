import { describe, expect, it } from 'vitest';
import { privadosBajo } from '../../../test/bucket.js';
import { limpiarBase } from '../../../test/limpiarBase.js';
import { tiendaLista } from '../../../test/tiendaLista.js';
import { backupBase } from '../backup.js';
import { aConservar } from '../podarBackups.js';
import { probarRestauracion } from '../probarRestauracion.js';

describe('worker: backup', () => {
  it('mysqldump real → comprimido + conteo de filas → la restauración no pierde filas', async () => {
    await limpiarBase();
    await tiendaLista(); // con datos: tiendas, usuarios y productos con filas
    const r = await backupBase();
    expect(r.clave).toMatch(/^backups\/test\/\d{4}-\d{2}-\d{2}\.sql\.gz$/);
    expect(await privadosBajo('backups/')).toEqual([
      r.clave.replace('.sql.gz', '.json'),
      r.clave,
    ]);
    const prueba = await probarRestauracion();
    expect(prueba).toMatchObject({ backup: r.clave, ok: true });
    expect(prueba.filas.productos).toBe(3);
  }, 120_000);

  it('retención: 14 días + día 1 de 6 meses, y nunca menos de los últimos 14 archivos', () => {
    const ahora = new Date('2026-10-20T12:00:00-03:00');
    // Hubo un mes sin backups: los 14 más nuevos son de agosto y se conservan igual.
    const agosto = Array.from(
      { length: 20 },
      (_, i) => `2026-08-${String(i + 1).padStart(2, '0')}`,
    );
    const fechas = [
      ...agosto,
      '2026-07-01',
      '2026-06-01',
      '2026-05-01',
      '2026-04-01',
      '2026-03-01',
      '2026-02-01',
      '2026-01-01',
    ];
    const quedan = aConservar(fechas, ahora);
    expect(quedan.size).toBe(14 + 6);
    expect(quedan.has('2026-08-20')).toBe(true);
    expect(quedan.has('2026-08-06')).toBe(false);
    expect(quedan.has('2026-01-01')).toBe(false); // el séptimo mensual ya no
  });
});
