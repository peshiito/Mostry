import { beforeEach, describe, expect, it, vi } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { limpiarBase } from '../../../test/limpiarBase.js';
import { reintentarBorrados } from '../reintentarBorrados.js';

// S3 simulado que siempre falla: así se prueba la espera creciente.
vi.mock('../../../shared/archivos/borrarClaves.js', () => ({
  borrarClaves: async (claves: string[]) =>
    claves.map((clave) => ({ clave, error: 'InternalError: caído' })),
}));

describe('reintentarBorrados cuando S3 sigue fallando', () => {
  beforeEach(limpiarBase);

  it('suma intentos, guarda el error y espera cada vez más', async () => {
    const t0 = new Date('2026-10-10T12:00:00Z');
    await db
      .insertInto('archivosPorBorrar')
      .values({ clave: 'tiendas/1/x.webp', reintentarEn: t0 })
      .execute();
    const fila = () =>
      db.selectFrom('archivosPorBorrar').selectAll().executeTakeFirstOrThrow();

    expect(await reintentarBorrados(t0)).toEqual({ borrados: 0, fallidos: 1 });
    expect(await fila()).toMatchObject({
      intentos: 1,
      ultimoError: 'InternalError: caído',
    });
    expect((await fila()).reintentarEn.getTime() - t0.getTime()).toBe(60_000);

    // Antes de que pase la espera, no se reintenta.
    expect(await reintentarBorrados(new Date(t0.getTime() + 30_000))).toEqual({
      borrados: 0,
      fallidos: 0,
    });
    await reintentarBorrados(new Date(t0.getTime() + 60_000));
    expect((await fila()).intentos).toBe(2);
    expect((await fila()).reintentarEn.getTime() - t0.getTime()).toBe(60_000 + 120_000);
  });
});
