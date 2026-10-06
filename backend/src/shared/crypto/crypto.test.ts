import { describe, expect, it } from 'vitest';
import { hashearClave, verificarClave } from './claves.js';
import { codigoNumerico, igualesSeguro } from './tokens.js';

describe('crypto', () => {
  it('argon2id verifica bien y nunca acepta hashes inválidos', async () => {
    const hash = await hashearClave('una-clave-larga');
    expect(await verificarClave(hash, 'una-clave-larga')).toBe(true);
    expect(await verificarClave(hash, 'otra')).toBe(false);
    expect(await verificarClave(undefined, 'una-clave-larga')).toBe(false);
    expect(await verificarClave('!pendiente-modulo-auth', 'x')).toBe(false);
  });

  it('genera códigos con el formato esperado', () => {
    expect(codigoNumerico()).toMatch(/^\d{6}$/);
    expect(igualesSeguro('abc', 'abc')).toBe(true);
    expect(igualesSeguro('abc', 'abd')).toBe(false);
  });
});
