import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { appConCuenta } from '../../../test/appConCuenta.js';

const haceDias = (n: number) => new Date(Date.now() - n * 86_400_000);

describe('suscripción: gracia y suspensión', () => {
  let p: Awaited<ReturnType<typeof appConCuenta>>['panel'];
  const vencerPrueba = (dias: number) =>
    db
      .updateTable('tiendas')
      .set({ pruebaHasta: haceDias(dias) })
      .execute();

  beforeEach(async () => {
    ({ panel: p } = await appConCuenta());
  });

  it('en prueba muestra los días que quedan y los datos para pagar', async () => {
    const res = await p.get('/panel/tienda/suscripcion').expect(200);
    expect(res.body).toMatchObject({
      estado: 'prueba',
      diasRestantes: 10,
      mostrarAviso: false,
    });
    expect(res.body.pago).toMatchObject({ monto: 1_000_000 });
  });

  it('en gracia la tienda sigue funcionando, con aviso', async () => {
    await vencerPrueba(1);
    const res = await p.get('/panel/tienda/suscripcion').expect(200);
    expect(res.body).toMatchObject({ estado: 'gracia', mostrarAviso: true });
    await p.patch('/panel/tienda/config', { frase: 'Sigo vendiendo' }).expect(200);
  });

  it('suspendida: puede leer, pero la API bloquea toda escritura', async () => {
    await vencerPrueba(4);
    expect((await p.get('/panel/tienda/suscripcion').expect(200)).body.estado).toBe(
      'suspendida',
    );
    await p.get('/panel/tienda/config').expect(200);
    const res = await p.patch('/panel/tienda/config', { frase: 'Hackeo' }).expect(403);
    expect(res.body.error.codigo).toBe('tienda_suspendida');
    await p.put('/panel/tienda/pausa', { pausada: true }).expect(403);
  });
});
