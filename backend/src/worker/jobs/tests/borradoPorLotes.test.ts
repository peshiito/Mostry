import { describe, expect, it, vi } from 'vitest';
import { borrarClaves } from '../../../shared/archivos/borrarClaves.js';

// S3 simulado que registra cuántas claves recibe cada DeleteObjects.
const tamanos: number[] = [];
vi.mock('../../../shared/archivos/clienteS3.js', () => ({
  s3: {
    send: async (cmd: { input: { Delete: { Objects: unknown[] } } }) => {
      tamanos.push(cmd.input.Delete.Objects.length);
      return tamanos.length === 2
        ? { Errors: [{ Code: 'X', Message: 'sin clave' }] }
        : {};
    },
  },
}));

describe('borrarClaves', () => {
  it('parte en lotes de 1000 y un error sin clave hace fallar su lote entero', async () => {
    const claves = Array.from({ length: 2500 }, (_, i) => `tiendas/1/${i}.webp`);
    const fallos = await borrarClaves(claves);
    expect(tamanos).toEqual([1000, 1000, 500]);
    expect(fallos).toHaveLength(1000);
    expect(fallos[0]?.clave).toBe('tiendas/1/1000.webp');
  });
});
