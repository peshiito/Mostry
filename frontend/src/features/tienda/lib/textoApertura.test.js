import { describe, expect, it } from 'vitest';
import { textoAbierta } from './textoApertura.js';

describe('textoAbierta', () => {
  it('muestra la hora de cierre, la medianoche o las 24 horas', () => {
    expect(textoAbierta('20:30')).toBe('Abierto · cierra a las 20:30');
    expect(textoAbierta('24:00')).toBe('Abierto · cierra a la medianoche');
    expect(textoAbierta(null)).toBe('Abierto las 24 horas');
  });
});
