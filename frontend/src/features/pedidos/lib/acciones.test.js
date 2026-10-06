import { describe, expect, it } from 'vitest';
import { accionPrincipal } from './acciones.js';

describe('accionPrincipal', () => {
  it('sigue el flujo de 6.1 según la entrega', () => {
    expect(accionPrincipal({ id: 1, estado: 'comprobante_enviado' }).ruta).toContain(
      '/comprobante',
    );
    expect(
      accionPrincipal({ estado: 'en_preparacion', entrega: 'envio' }).siguiente,
    ).toBe('en_camino');
    expect(
      accionPrincipal({ estado: 'en_preparacion', entrega: 'retiro' }).siguiente,
    ).toBe('listo_retirar');
    expect(accionPrincipal({ estado: 'entregado' })).toBeNull();
  });
});
