import { describe, expect, it } from 'vitest';
import { calcularDescuento, disponibles } from './descuento.js';

describe('calcularDescuento (igual que el servidor)', () => {
  it('porcentaje con tope, monto hasta el subtotal y regalo en 0', () => {
    expect(
      calcularDescuento({ tipo: 'porcentaje', valor: 50, tope: 30_000 }, 70_000),
    ).toBe(30_000);
    expect(calcularDescuento({ tipo: 'porcentaje', valor: 20, tope: null }, 70_050)).toBe(
      14_000,
    );
    expect(calcularDescuento({ tipo: 'monto', valor: 500_000 }, 70_000)).toBe(70_000);
    expect(calcularDescuento({ tipo: 'regalo', descripcion: 'x' }, 70_000)).toBe(0);
    expect(calcularDescuento(null, 70_000)).toBe(0);
  });

  it('disponibles según los sellos', () => {
    const premios = [{ compras: 2 }, { compras: 5 }];
    expect(disponibles(premios, 3)).toEqual([{ compras: 2 }]);
  });
});
