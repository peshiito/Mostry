import { describe, expect, it } from 'vitest';
import { nuevoVencimiento } from './plan.js';

describe('nuevoVencimiento', () => {
  const hoy = new Date('2026-10-14T12:00:00Z');
  it('suma 30 días al plan vigente', () => {
    expect(nuevoVencimiento('2026-10-17T03:00:00Z', hoy).toISOString()).toBe(
      '2026-11-16T03:00:00.000Z',
    );
  });
  it('si ya venció, cuenta desde hoy', () => {
    expect(nuevoVencimiento('2026-09-01T03:00:00Z', hoy).toISOString()).toBe(
      '2026-11-13T12:00:00.000Z',
    );
  });
});
