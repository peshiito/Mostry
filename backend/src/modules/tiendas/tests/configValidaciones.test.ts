import { beforeEach, describe, expect, it } from 'vitest';
import { appConCuenta } from '../../../test/appConCuenta.js';

describe('Mi tienda: validaciones', () => {
  let p: Awaited<ReturnType<typeof appConCuenta>>['panel'];

  beforeEach(async () => {
    ({ panel: p } = await appConCuenta());
  });

  it('valida rangos, paletas y WhatsApp', async () => {
    for (const malo of [
      { senaPorcentaje: 101 },
      { costoEnvio: -1 },
      { paleta: 'rosa-chicle' },
      { whatsapp: '15 2345 6789' },
      {},
    ]) {
      await p.patch('/tienda/config', malo).expect(400);
    }
  });

  it('no deja apagar envío y retiro a la vez', async () => {
    await p.patch('/tienda/config', { aceptaEnvio: false }).expect(200);
    const res = await p.patch('/tienda/config', { aceptaRetiro: false }).expect(400);
    expect(res.body.error.codigo).toBe('entrega_requerida');
  });
});
