import { describe, expect, it } from 'vitest';
import { errorTramos } from './tramos.js';

describe('errorTramos', () => {
  it('acepta mañana y tarde separadas', () => {
    expect(
      errorTramos([
        ['07:00', '13:00'],
        ['16:30', '20:30'],
      ]),
    ).toBeNull();
  });
  it('detecta superposición y tramos al revés', () => {
    expect(
      errorTramos([
        ['07:00', '13:00'],
        ['12:00', '20:30'],
      ]),
    ).toMatch(/superponen/);
    expect(errorTramos([['13:00', '07:00']])).toMatch(/cerrar después/);
  });
});
