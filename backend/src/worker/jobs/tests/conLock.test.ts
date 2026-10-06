import { describe, expect, it } from 'vitest';
import { conLock } from '../../conLock.js';

describe('conLock (GET_LOCK de MySQL)', () => {
  it('una segunda ejecución simultánea de la misma tarea se saltea', async () => {
    let liberar!: () => void;
    const bloqueada = new Promise<void>((r) => (liberar = r));
    const primera = conLock('test-lock', async () => {
      await bloqueada;
      return 'primera';
    });
    // Le damos tiempo a la primera para tomar el lock.
    await new Promise((r) => setTimeout(r, 200));
    expect(await conLock('test-lock', async () => 'segunda')).toEqual({
      ejecutado: false,
    });
    liberar();
    expect(await primera).toEqual({ ejecutado: true, resultado: 'primera' });
  });

  it('libera el lock aunque la tarea falle', async () => {
    await expect(
      conLock('test-lock-2', async () => Promise.reject(new Error('boom'))),
    ).rejects.toThrow('boom');
    expect(await conLock('test-lock-2', async () => 'ok')).toEqual({
      ejecutado: true,
      resultado: 'ok',
    });
  });
});
