import { describe, expect, it } from 'vitest';
import { textoCompras, textoPremio, textoVence } from './textoPremio.js';

describe('textoPremio', () => {
  it('describe cada tipo de premio', () => {
    expect(textoPremio({ tipo: 'porcentaje', valor: 20, tope: null })).toBe(
      '20 % de descuento',
    );
    expect(textoPremio({ tipo: 'porcentaje', valor: 75, tope: 500_000 })).toBe(
      '75 % de descuento (hasta $ 5.000)',
    );
    expect(textoPremio({ tipo: 'monto', valor: 300_000 })).toBe('$ 3.000 de descuento');
    expect(textoPremio({ tipo: 'regalo', descripcion: 'Un café' })).toBe(
      'De regalo: Un café',
    );
  });

  it('compras y vencimiento', () => {
    expect(textoCompras(1)).toBe('1 compra');
    expect(textoCompras(5)).toBe('5 compras');
    expect(textoVence(null)).toBeNull();
    expect(textoVence(6)).toBe('Los sellos duran 6 meses');
  });
});
