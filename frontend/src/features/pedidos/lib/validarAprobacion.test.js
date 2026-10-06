import { describe, expect, it } from 'vitest';
import { validarAprobacion } from './validarAprobacion.js';

const ok = {
  monto: '9.950',
  fecha: '2026-10-14',
  titular: 'Lucía Gómez',
  operacion: '4928174921',
};

describe('validarAprobacion', () => {
  it('acepta el monto exacto', () => {
    expect(validarAprobacion(ok, 995000)).toEqual({});
  });
  it('rechaza un monto distinto', () => {
    expect(validarAprobacion({ ...ok, monto: '8450' }, 995000).monto).toMatch(
      /No coincide/,
    );
  });
});
