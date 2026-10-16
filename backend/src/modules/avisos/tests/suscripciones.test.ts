import { beforeEach, describe, expect, it } from 'vitest';
import { suscripcion } from '../../../test/avisos.js';
import { crearCuentaCompleta } from '../../../test/flujoAuth.js';
import { panel } from '../../../test/panel.js';
import { tiendaLista } from '../../../test/tiendaLista.js';

// Avisos 1: cada teléfono que activa los avisos deja su suscripción.
describe('avisos: suscripciones', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;
  const estado = async () => (await t.panel.get('/panel/avisos').expect(200)).body;

  beforeEach(async () => {
    t = await tiendaLista();
  });

  it('alta, misma suscripción de nuevo (no duplica) y baja', async () => {
    expect(await estado()).toMatchObject({
      telefonos: 0,
      silencio: { desde: null, hasta: null },
    });
    await t.panel.post('/panel/avisos/suscripciones', suscripcion(1)).expect(201);
    await t.panel.post('/panel/avisos/suscripciones', suscripcion(1)).expect(201);
    await t.panel.post('/panel/avisos/suscripciones', suscripcion(2)).expect(201);
    expect((await estado()).telefonos).toBe(2);
    await t.panel
      .post('/panel/avisos/suscripciones/baja', { endpoint: suscripcion(1).endpoint })
      .expect(204);
    expect((await estado()).telefonos).toBe(1);
  });

  it('solo acepta servicios de push conocidos, por https (anti-SSRF)', async () => {
    for (const host of [
      '169.254.169.254',
      'localhost:3000',
      'fcm.googleapis.com.evil.com',
    ]) {
      const res = await t.panel.post('/panel/avisos/suscripciones', suscripcion(1, host));
      expect(res.status).toBe(400);
    }
    for (const endpoint of [
      'http://fcm.googleapis.com/x',
      'https:///fcm.googleapis.com/fcm/send/x', // url.parse lo manda a localhost
      'https://\\fcm.googleapis.com/fcm/send/x',
    ]) {
      const res = await t.panel.post('/panel/avisos/suscripciones', {
        ...suscripcion(1),
        endpoint,
      });
      expect(res.status).toBe(400);
    }
    const apple = suscripcion(3, 'web.push.apple.com');
    await t.panel.post('/panel/avisos/suscripciones', apple).expect(201);
  });

  it('otra tienda no ve ni borra los teléfonos ajenos', async () => {
    await t.panel.post('/panel/avisos/suscripciones', suscripcion(1)).expect(201);
    const martin = await crearCuentaCompleta(t.app, t.correo, 'heladeria');
    const ajeno = panel(t.app, 'heladeria', martin.cookie);
    expect((await ajeno.get('/panel/avisos')).body.telefonos).toBe(0);
    await ajeno.post('/panel/avisos/suscripciones/baja', {
      endpoint: suscripcion(1).endpoint,
    });
    expect((await estado()).telefonos).toBe(1);
  });
});
