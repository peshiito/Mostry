import { describe, expect, it } from 'vitest';
import { estadoEfectivo, resumenSuscripcion } from '../servicios/estadoSuscripcion.js';

const ahora = new Date('2026-10-10T12:00:00Z');
const dias = (n: number) => new Date(ahora.getTime() + n * 86_400_000);
const prueba = (hasta: Date | null) => ({
  estado: 'prueba' as const,
  pruebaHasta: hasta,
  planHasta: null,
  suspendidaManual: false,
});

describe('estado de la suscripción', () => {
  it('prueba sin arrancar (email sin verificar) respeta el estado guardado', () => {
    expect(estadoEfectivo(prueba(null), ahora)).toBe('prueba');
  });

  it('prueba → gracia (3 días) → suspendida', () => {
    expect(estadoEfectivo(prueba(dias(1)), ahora)).toBe('prueba');
    expect(estadoEfectivo(prueba(dias(-1)), ahora)).toBe('gracia');
    expect(estadoEfectivo(prueba(dias(-2.9)), ahora)).toBe('gracia');
    expect(estadoEfectivo(prueba(dias(-3)), ahora)).toBe('suspendida');
  });

  it('con plan pago vigente está activa, aunque la prueba haya vencido', () => {
    const t = {
      estado: 'suspendida' as const,
      pruebaHasta: dias(-20),
      planHasta: dias(25),
      suspendidaManual: false,
    };
    expect(estadoEfectivo(t, ahora)).toBe('activa');
  });

  it('plan vencido también pasa por gracia antes de suspender', () => {
    const t = {
      estado: 'activa' as const,
      pruebaHasta: dias(-40),
      planHasta: dias(-1),
      suspendidaManual: false,
    };
    expect(estadoEfectivo(t, ahora)).toBe('gracia');
  });

  it('la suspensión manual pisa un plan vigente', () => {
    const t = {
      estado: 'activa' as const,
      pruebaHasta: null,
      planHasta: dias(20),
      suspendidaManual: true,
    };
    expect(estadoEfectivo(t, ahora)).toBe('suspendida');
  });

  it('avisa en los últimos 3 días de prueba (días 7 a 10) y en gracia', () => {
    expect(resumenSuscripcion(prueba(dias(5)), ahora).mostrarAviso).toBe(false);
    expect(resumenSuscripcion(prueba(dias(3)), ahora)).toMatchObject({
      diasRestantes: 3,
      mostrarAviso: true,
    });
    expect(resumenSuscripcion(prueba(dias(-1)), ahora)).toMatchObject({
      estado: 'gracia',
      diasRestantes: 0,
      mostrarAviso: true,
    });
  });
});
