import { beforeEach, describe, expect, it } from 'vitest';
import { crearApp } from '../../../app.js';
import { club, datosCliente } from '../../../test/clubListo.js';
import { limpiarBase } from '../../../test/limpiarBase.js';
import { crearMailerFalso } from '../../../test/mailerFalso.js';

// Alta a medias con un email ajeno: no bloquea al dueño ni le deja la cuenta al otro.
describe('Club · registro con un email ajeno', () => {
  let correo: ReturnType<typeof crearMailerFalso>;
  let api: ReturnType<typeof club>;

  beforeEach(async () => {
    await limpiarBase();
    correo = crearMailerFalso();
    api = club(crearApp({ pingDb: async () => {}, mailer: correo.mailer }));
  });

  it('nadie se queda con un email ajeno registrándolo antes (sin verificar)', async () => {
    // Un atacante registra el email de Ana con SU clave y no verifica.
    await api
      .post('/registro', datosCliente({ clave: 'clave-del-atacante' }))
      .expect(201);
    // Ana se registra con la suya: valen sus datos y le llega un código nuevo.
    await api.post('/registro', datosCliente({ nombre: 'Ana' })).expect(201);
    const codigo = correo.ultimoCodigo('ana@test.com');
    const conClave = (clave: string) =>
      api.post('/verificar-email', { email: 'ana@test.com', codigo, clave });
    await conClave('clave-del-atacante').expect(400);
    await conClave(datosCliente().clave).expect(200);
    const login = await api.post('/login', {
      email: 'ana@test.com',
      clave: 'clave-del-atacante',
    });
    expect(login.status).toBe(401);
  });
});
