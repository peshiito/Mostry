import request from 'supertest';
import { describe, it } from 'vitest';
import { origenTienda } from '../../../test/sesionHttp.js';
import { soporteListo } from '../../../test/soporteListo.js';

// El modo soporte vive SOLO en /admin/soporte: la cookie del admin no abre el
// panel de la tienda, ni siquiera con un permiso vigente.
describe('modo soporte: la cookie de admin no sirve en el panel', () => {
  it('caja, pedidos y libreta del panel dan 401 con la cookie de admin', async () => {
    const { t, admin } = await soporteListo();
    for (const ruta of ['/panel/caja', '/panel/pedidos', '/panel/libreta/clientes']) {
      const r = request(t.app).get(ruta).set('Origin', origenTienda('dona-rosa'));
      await r.set('Cookie', admin.cookie).expect(401);
    }
  });

  it('el admin no se puede dar el permiso de soporte a sí mismo', async () => {
    const { t, admin } = await soporteListo(false);
    const conAdmin = (r: request.Test) =>
      r.set('Origin', origenTienda('dona-rosa')).set('Cookie', admin.cookie);
    await conAdmin(request(t.app).post('/panel/soporte/acceso')).expect(401);
    await conAdmin(request(t.app).get('/panel/soporte')).expect(401);
  });
});
