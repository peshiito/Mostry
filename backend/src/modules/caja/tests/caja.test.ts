import { beforeEach, describe, expect, it } from 'vitest';
import { appConCuenta } from '../../../test/appConCuenta.js';

describe('caja del día', () => {
  let p: Awaited<ReturnType<typeof appConCuenta>>['panel'];
  const mov = (tipo: string, medio: string, monto: number) =>
    p.post('/panel/caja/movimientos', {
      tipo,
      medio,
      monto,
      concepto: `${tipo} de prueba`,
    });

  beforeEach(async () => {
    ({ panel: p } = await appConCuenta());
  });

  it('abre, registra y cierra con la diferencia correcta (sección 6.4)', async () => {
    await p.post('/panel/caja/abrir', { montoApertura: 1_000_000 }).expect(201);
    await mov('ingreso', 'efectivo', 500_000).expect(201);
    await mov('egreso', 'efectivo', 200_000).expect(201);
    await mov('deposito', 'efectivo', 300_000).expect(201);
    await mov('ingreso', 'transferencia', 900_000).expect(201); // no cuenta para el efectivo
    const actual = (await p.get('/panel/caja').expect(200)).body;
    expect(actual.esperado).toBe(1_000_000 + 500_000 - 200_000 - 300_000);
    const cerrada = (
      await p.post('/panel/caja/cerrar', { montoContado: 950_000 }).expect(200)
    ).body;
    expect(cerrada).toMatchObject({ montoContado: 950_000, diferencia: -50_000 });
    expect(cerrada.cerradaEn).not.toBeNull();
  });

  it('una por día: no se abre dos veces ni se reabre después de cerrar', async () => {
    await p.post('/panel/caja/abrir', { montoApertura: 0 }).expect(201);
    expect(
      (await p.post('/panel/caja/abrir', { montoApertura: 0 }).expect(409)).body.error
        .codigo,
    ).toBe('caja_ya_abierta');
    await p.post('/panel/caja/cerrar', { montoContado: 0 }).expect(200);
    expect(
      (await p.post('/panel/caja/abrir', { montoApertura: 0 }).expect(409)).body.error
        .codigo,
    ).toBe('caja_ya_cerrada_hoy');
    await p.post('/panel/caja/cerrar', { montoContado: 0 }).expect(409);
  });

  it('con la caja cerrada: efectivo no, transferencia sí (sin caja asignada)', async () => {
    expect((await mov('ingreso', 'efectivo', 1000).expect(409)).body.error.codigo).toBe(
      'caja_cerrada',
    );
    await mov('ingreso', 'transferencia', 1000).expect(201);
    const resumen = (await p.get('/panel/caja/resumen').expect(200)).body;
    expect(resumen.movimientos).toEqual([
      expect.objectContaining({ cajaId: null, medio: 'transferencia', monto: 1000 }),
    ]);
  });
});
