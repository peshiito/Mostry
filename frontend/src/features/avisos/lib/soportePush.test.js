import { describe, expect, it } from 'vitest';
import { aBytes, nombreDispositivo } from './soportePush.js';

describe('avisos: navegador', () => {
  it('pasa la clave pública base64url a bytes', () => {
    expect([...aBytes('AQID_-8')]).toEqual([1, 2, 3, 255, 239]);
  });
  it('nombra el teléfono sin datos de más', () => {
    const android =
      'Mozilla/5.0 (Linux; Android 14) AppleWebKit Chrome/130 Mobile Safari';
    expect(nombreDispositivo(android)).toBe('Android · Chrome');
    const iphone =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) AppleWebKit Version/17 Safari';
    expect(nombreDispositivo(iphone)).toBe('iPhone · Safari');
  });
});
