import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { appConCuenta } from '../../../test/appConCuenta.js';

describe('Mi tienda: /tienda/config', () => {
  let p: Awaited<ReturnType<typeof appConCuenta>>['panel'];

  beforeEach(async () => {
    ({ panel: p } = await appConCuenta());
  });

  it('devuelve la configuración de la tienda', async () => {
    const res = await p.get('/panel/tienda/config').expect(200);
    expect(res.body).toMatchObject({
      slug: 'dona-rosa',
      paleta: 'toldo',
      aceptaEnvio: true,
    });
  });

  it('edita, normaliza el WhatsApp y borra textos vacíos', async () => {
    const cambios = {
      frase: 'Facturas caseras',
      whatsapp: '11 2345-6789',
      zonaEnvio: '',
      paleta: 'menta',
    };
    const res = await p.patch('/panel/tienda/config', cambios).expect(200);
    expect(res.body).toMatchObject({
      frase: 'Facturas caseras',
      whatsapp: '5491123456789',
      zonaEnvio: null,
      paleta: 'menta',
    });
  });

  it('rechaza tocar estado, plan o slug (mass assignment)', async () => {
    for (const campo of [
      { estado: 'activa' },
      { planHasta: '2030-01-01' },
      { slug: 'otra' },
      { alias: 'x.y.z.w' },
    ]) {
      await p.patch('/panel/tienda/config', campo).expect(400);
    }
    const tienda = await db
      .selectFrom('tiendas')
      .select(['estado', 'planHasta'])
      .executeTakeFirstOrThrow();
    expect(tienda).toEqual({ estado: 'prueba', planHasta: null });
  });

  it('pausa y despausa la tienda', async () => {
    expect(
      (await p.put('/panel/tienda/pausa', { pausada: true }).expect(200)).body,
    ).toEqual({
      pausada: true,
    });
    expect((await p.get('/panel/tienda/config')).body.pausada).toBe(true);
  });
});
