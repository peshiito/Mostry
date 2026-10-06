import { beforeEach, describe, expect, it, vi } from 'vitest';
import { encolarBorrado } from '../../../shared/archivos/colaBorrado.js';
import { db } from '../../../shared/db/db.js';
import { limpiarBase } from '../../../test/limpiarBase.js';
import { MAX_INTENTOS, reintentarBorrados } from '../reintentarBorrados.js';

// S3 simulado: solo falla la clave que contiene "rota".
const llamadas: string[][] = [];
vi.mock('../../../shared/archivos/borrarClaves.js', () => ({
  borrarClaves: async (claves: string[]) => {
    llamadas.push(claves);
    return claves
      .filter((c) => c.includes('rota'))
      .map((clave) => ({ clave, error: 'AccessDenied' }));
  },
}));

const filas = () =>
  db
    .selectFrom('archivosPorBorrar')
    .select(['clave', 'intentos'])
    .orderBy('clave')
    .execute();

describe('cola de borrados: lote mixto y tope de intentos', () => {
  beforeEach(async () => {
    await limpiarBase();
    llamadas.length = 0;
  });

  it('borra las que salen y reprograma solo la que falla', async () => {
    await db
      .insertInto('archivosPorBorrar')
      .values([{ clave: 'a' }, { clave: 'b-rota' }, { clave: 'c' }])
      .execute();
    expect(await reintentarBorrados()).toEqual({ borrados: 2, fallidos: 1 });
    expect(await filas()).toEqual([{ clave: 'b-rota', intentos: 1 }]);
  });

  it('con MAX_INTENTOS no se reintenta más (ni se llama a S3)', async () => {
    await db
      .insertInto('archivosPorBorrar')
      .values({ clave: 'x-rota', intentos: MAX_INTENTOS })
      .execute();
    expect(await reintentarBorrados()).toEqual({ borrados: 0, fallidos: 0 });
    expect(llamadas).toEqual([]);
  });

  it('volver a encolar una clave agotada NO la revive (ya se alertó; si no, nunca llegaría al tope)', async () => {
    await db
      .insertInto('archivosPorBorrar')
      .values({ clave: 'x-rota', intentos: MAX_INTENTOS })
      .execute();
    await encolarBorrado([{ clave: 'x-rota', error: 'de nuevo' }]);
    expect(await filas()).toEqual([{ clave: 'x-rota', intentos: MAX_INTENTOS }]);
  });
});
