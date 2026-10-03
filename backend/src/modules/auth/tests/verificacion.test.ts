import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { crearApp } from '../../../app.js';
import { db } from '../../../shared/db/db.js';
import { CLAVE } from '../../../test/flujoAuth.js';
import { limpiarBase } from '../../../test/limpiarBase.js';
import { crearMailerFalso } from '../../../test/mailerFalso.js';
import { ORIGEN_SITIO } from '../../../test/sesionHttp.js';

const email = 'rosa@test.com';
const registro = {
  email,
  clave: CLAVE,
  nombre: 'Rosa',
  nombreNegocio: 'Doña Rosa',
  slug: 'dona-rosa',
};

describe('verificación de email', () => {
  let correo: ReturnType<typeof crearMailerFalso>;
  let post: (ruta: string, body: object) => request.Test;

  beforeEach(async () => {
    await limpiarBase();
    correo = crearMailerFalso();
    const app = crearApp({ pingDb: async () => {}, mailer: correo.mailer });
    post = (ruta, body) => request(app).post(ruta).set('Origin', ORIGEN_SITIO).send(body);
    await post('/auth/registro', registro).expect(201);
  });

  it('con el código correcto verifica y arranca 10 días de prueba', async () => {
    await post('/auth/verificar-email', {
      email,
      codigo: correo.ultimoCodigo(email),
    }).expect(200);
    const tienda = await db
      .selectFrom('tiendas')
      .select('pruebaHasta')
      .executeTakeFirstOrThrow();
    const dias = (tienda.pruebaHasta!.getTime() - Date.now()) / 86_400_000;
    // MySQL guarda DATETIME al segundo: puede dar 10,00001 días.
    expect(dias).toBeCloseTo(10, 3);
  });

  it('el código sirve una sola vez', async () => {
    const codigo = correo.ultimoCodigo(email);
    await post('/auth/verificar-email', { email, codigo }).expect(200);
    await post('/auth/verificar-email', { email, codigo }).expect(400);
  });

  it('5 intentos fallidos queman el código, aunque después llegue el correcto', async () => {
    const codigo = correo.ultimoCodigo(email)!;
    const incorrecto = codigo === '000000' ? '111111' : '000000';
    for (let i = 0; i < 5; i++) {
      await post('/auth/verificar-email', { email, codigo: incorrecto }).expect(400);
    }
    await post('/auth/verificar-email', { email, codigo }).expect(400);
  });
});
