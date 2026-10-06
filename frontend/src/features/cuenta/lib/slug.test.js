import { describe, expect, it } from 'vitest';
import { errorSlug, limpiarSlug } from './slug.js';

describe('slug', () => {
  it('limpia tildes, mayúsculas y símbolos', () => {
    expect(limpiarSlug('Panadería Ñandú!')).toBe('panaderianandu');
  });
  it('rechaza reservados y cortos', () => {
    expect(errorSlug('admin')).toMatch(/no se puede/);
    expect(errorSlug('ab')).toMatch(/Mínimo/);
    expect(errorSlug('laespiga')).toBeNull();
  });
});
