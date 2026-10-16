import { describe, expect, it } from 'vitest';
import { anticipacionDe } from './anticipacion.js';

describe('anticipación del encargo', () => {
  it('gana la mayor entre la tienda y los productos', () => {
    const tienda = { anticipacionEncargoHoras: 24 };
    expect(anticipacionDe(tienda, [{ anticipacionHoras: null }])).toBe(24);
    expect(
      anticipacionDe(tienda, [{ anticipacionHoras: 2 }, { anticipacionHoras: 48 }]),
    ).toBe(48);
    expect(anticipacionDe(tienda, [])).toBe(24);
  });
});
