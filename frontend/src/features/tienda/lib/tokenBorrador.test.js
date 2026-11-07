import { afterEach, describe, expect, it, vi } from 'vitest';
import { salirDelBorrador, tokenBorrador } from './tokenBorrador.js';

const TOKEN = `1999999999999.${'a'.repeat(64)}`;

describe('token del borrador', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    sessionStorage.clear();
  });

  it('sale de la URL, se guarda y sigue al navegar; Salir lo borra', () => {
    expect(tokenBorrador('rosa', `?borrador=${TOKEN}`)).toBe(TOKEN);
    expect(tokenBorrador('rosa', '')).toBe(TOKEN);
    expect(tokenBorrador('otra', '')).toBeNull();
    salirDelBorrador('rosa');
    expect(tokenBorrador('rosa', '')).toBeNull();
  });

  it('ignora tokens con otra forma', () => {
    expect(tokenBorrador('rosa', '?borrador=<script>')).toBeNull();
  });

  it('si el navegador no deja guardar, vale con la URL', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('bloqueado');
    });
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('bloqueado');
    });
    expect(tokenBorrador('rosa', `?borrador=${TOKEN}`)).toBe(TOKEN);
    expect(tokenBorrador('rosa', '')).toBeNull();
  });
});
