import { beforeEach, describe, it } from 'vitest';
import { appConCuenta } from '../../../test/appConCuenta.js';

describe('caja: validaciones', () => {
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

  it('valida: depósito por transferencia, montos negativos o campos de más', async () => {
    await p.post('/panel/caja/abrir', { montoApertura: 0 }).expect(201);
    await mov('deposito', 'transferencia', 1000).expect(400);
    await mov('ingreso', 'efectivo', -5).expect(400);
    await p
      .post('/panel/caja/movimientos', {
        tipo: 'ingreso',
        medio: 'efectivo',
        monto: 1,
        concepto: 'x1',
        origen: 'pedido',
      })
      .expect(400);
  });
});
