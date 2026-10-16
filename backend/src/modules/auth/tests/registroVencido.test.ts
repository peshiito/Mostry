import { sql } from 'kysely';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { crearApp } from '../../../app.js';
import { db } from '../../../shared/db/db.js';
import { CLAVE } from '../../../test/flujoAuth.js';
import { limpiarBase } from '../../../test/limpiarBase.js';
import { crearMailerFalso } from '../../../test/mailerFalso.js';
import { ORIGEN_SITIO } from '../../../test/sesionHttp.js';

const datos = (clave = CLAVE) => ({
  email: 'tati@test.com',
  clave,
  nombre: 'Tati',
  nombreNegocio: 'Tati Shop',
  aceptoTerminos: true,
  slug: 'tatishop',
});

// Mejoras 4: un registro que nunca se verificó no bloquea el email para siempre.
describe('registro sin verificar', () => {
  let correo: ReturnType<typeof crearMailerFalso>;
  let app: ReturnType<typeof crearApp>;
  const registrar = (d: object) =>
    request(app).post('/auth/registro').set('Origin', ORIGEN_SITIO).send(d);

  beforeEach(async () => {
    await limpiarBase();
    correo = crearMailerFalso();
    app = crearApp({ pingDb: async () => {}, mailer: correo.mailer });
    await registrar(datos()).expect(201);
  });

  it('mientras no venció, nadie lo puede pisar (ni el link)', async () => {
    expect((await registrar(datos('otra-clave-larga'))).status).toBe(409);
    const usuarios = await db.selectFrom('usuarios').select('hashClave').execute();
    expect(usuarios).toHaveLength(1);
  });

  it('pasada media hora se libera: se registra de nuevo y verifica', async () => {
    // Simula que pasó media hora (creado_en no se puede tocar desde la app).
    await sql`UPDATE usuarios SET creado_en = NOW() - INTERVAL 31 MINUTE`.execute(db);
    await registrar(datos('otra-clave-larga')).expect(201);
    const codigo = correo.ultimoCodigo('tati@test.com');
    await request(app)
      .post('/auth/verificar-email')
      .set('Origin', ORIGEN_SITIO)
      .send({ email: 'tati@test.com', codigo })
      .expect(200);
    expect(await db.selectFrom('tiendas').select('slug').execute()).toEqual([
      { slug: 'tatishop' },
    ]);
  });
});
