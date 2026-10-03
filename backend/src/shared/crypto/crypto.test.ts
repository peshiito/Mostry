import { describe, expect, it } from 'vitest';
import { cifrar, descifrar } from './cifrado.js';
import { hashearClave, verificarClave } from './claves.js';
import { codigoNumerico, codigoRecuperacion, igualesSeguro } from './tokens.js';

describe('crypto', () => {
  it('cifra y descifra; cada cifrado es distinto', () => {
    const a = cifrar('JBSWY3DPEHPK3PXP');
    expect(a).not.toBe(cifrar('JBSWY3DPEHPK3PXP'));
    expect(descifrar(a)).toBe('JBSWY3DPEHPK3PXP');
  });

  it('detecta un dato cifrado manipulado', () => {
    const [iv, tag, datos] = cifrar('secreto').split('.');
    const alterado = `${iv}.${tag}.${datos!.slice(0, -2)}AA`;
    expect(() => descifrar(alterado)).toThrow();
  });

  it('argon2id verifica bien y nunca acepta hashes inválidos', async () => {
    const hash = await hashearClave('una-clave-larga');
    expect(await verificarClave(hash, 'una-clave-larga')).toBe(true);
    expect(await verificarClave(hash, 'otra')).toBe(false);
    expect(await verificarClave(undefined, 'una-clave-larga')).toBe(false);
    expect(await verificarClave('!pendiente-modulo-auth', 'x')).toBe(false);
  });

  it('genera códigos con el formato esperado', () => {
    expect(codigoNumerico()).toMatch(/^\d{6}$/);
    expect(codigoRecuperacion()).toMatch(/^[a-z2-7]{5}-[a-z2-7]{5}$/);
    expect(igualesSeguro('abc', 'abc')).toBe(true);
    expect(igualesSeguro('abc', 'abd')).toBe(false);
  });
});
