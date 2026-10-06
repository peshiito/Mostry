import { beforeEach, describe, expect, it } from 'vitest';
import { appConCuenta } from '../../../test/appConCuenta.js';

describe('inversiones y proveedores', () => {
  let p: Awaited<ReturnType<typeof appConCuenta>>['panel'];
  let molino: number;

  beforeEach(async () => {
    ({ panel: p } = await appConCuenta());
    molino = (
      await p
        .post('/panel/proveedores', {
          nombre: 'Molino Harinero',
          contacto: '11 4444-5555',
        })
        .expect(201)
    ).body.id;
  });

  it('las inversiones van aparte y no bajan la ganancia real', async () => {
    await p
      .post('/panel/gastos', {
        tipo: 'inversion',
        monto: 5_000_000,
        medio: 'transferencia',
        detalle: 'Horno',
      })
      .expect(201);
    expect((await p.get('/panel/caja/resumen')).body).toMatchObject({
      inversiones: 5_000_000,
      gananciaReal: 0,
    });
  });

  it('proveedores: se desactivan (no se borran) y uno desactivado no se usa', async () => {
    await p.patch(`/panel/proveedores/${molino}`, { activo: false }).expect(200);
    expect((await p.get('/panel/proveedores')).body).toEqual([]);
    expect((await p.get('/panel/proveedores?proveedores=todos')).body).toHaveLength(1);
    const res = await p.post('/panel/gastos', {
      tipo: 'gasto',
      monto: 1,
      medio: 'transferencia',
      proveedorId: molino,
    });
    expect(res.body.error.codigo).toBe('proveedor_invalido');
  });
});
