import { describe, expect, it } from 'vitest';
import { diferencia, efectivoEsperado, gananciaReal } from './calculos.js';

const caja = {
  apertura: 1000000,
  ingresosEfectivo: 4880000,
  egresosEfectivo: 650000,
  depositos: 200000,
};

describe('caja', () => {
  it('calcula el efectivo esperado con los depósitos', () => {
    expect(efectivoEsperado(caja)).toBe(5030000);
  });
  it('la diferencia es contado menos esperado', () => {
    expect(diferencia(4880000, caja)).toBe(-150000);
  });
  it('la ganancia real descuenta devoluciones y gastos', () => {
    expect(gananciaReal({ ingresos: 1000, devoluciones: 100, gastos: 300 })).toBe(600);
  });
});
