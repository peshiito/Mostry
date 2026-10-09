import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { crearApp } from '../../../app.js';
import { db } from '../../../shared/db/db.js';
import { CLAVE, registrarYVerificar } from '../../../test/flujoAuth.js';
import { limpiarBase } from '../../../test/limpiarBase.js';
import { crearMailerFalso } from '../../../test/mailerFalso.js';
import { ORIGEN_SITIO } from '../../../test/sesionHttp.js';

// Más casos del ingreso desde la landing: cada uno ve solo SUS tiendas, y una
// cuenta desactivada no da más pistas que un email inexistente.
describe('login desde la landing: casos borde', () => {
  let app: ReturnType<typeof crearApp>;
  let correo: ReturnType<typeof crearMailerFalso>;
  const entrar = (email: string) =>
    request(app)
      .post('/auth/login')
      .set('Origin', ORIGEN_SITIO)
      .send({ email, clave: CLAVE });

  beforeEach(async () => {
    await limpiarBase();
    correo = crearMailerFalso();
    app = crearApp({ pingDb: async () => {}, mailer: correo.mailer });
  });

  it('con dos comercios, cada uno recibe solo su tienda', async () => {
    const rosa = await registrarYVerificar(app, correo, 'dona-rosa');
    await registrarYVerificar(app, correo, 'heladeria');
    const { body } = await entrar(rosa).expect(200);
    expect(body.destino.tiendas.map((t: { slug: string }) => t.slug)).toEqual([
      'dona-rosa',
    ]);
  });

  it('una cuenta desactivada da el mismo error que un email que no existe', async () => {
    const rosa = await registrarYVerificar(app, correo, 'dona-rosa');
    await db
      .updateTable('usuarios')
      .set({ activo: false })
      .where('email', '=', rosa)
      .execute();
    const desactivada = await entrar(rosa).expect(401);
    const nadie = await entrar('nadie@test.com').expect(401);
    expect(desactivada.body).toEqual(nadie.body);
  });
});
