import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { crearApp } from '../../../app.js';
import { db } from '../../../shared/db/db.js';
import { CLAVE } from '../../../test/flujoAuth.js';
import { limpiarBase } from '../../../test/limpiarBase.js';
import { crearMailerFalso } from '../../../test/mailerFalso.js';
import { ORIGEN_SITIO, origenTienda } from '../../../test/sesionHttp.js';

const datos = (extra = {}) => ({
  email: 'rosa@test.com',
  clave: CLAVE,
  nombre: 'Rosa',
  nombreNegocio: 'Doña Rosa',
  slug: 'dona-rosa',
  ...extra,
});

describe('POST /auth/registro', () => {
  let correo: ReturnType<typeof crearMailerFalso>;
  let registrar: (body: object, origen?: string) => request.Test;

  beforeEach(async () => {
    await limpiarBase();
    correo = crearMailerFalso();
    const app = crearApp({ pingDb: async () => {}, mailer: correo.mailer });
    registrar = (body, origen = ORIGEN_SITIO) =>
      request(app).post('/auth/registro').set('Origin', origen).send(body);
  });

  it('crea usuario, tienda y membresía, y manda el código', async () => {
    await registrar(datos()).expect(201);
    expect(correo.ultimoCodigo('rosa@test.com')).toMatch(/^\d{6}$/);
    const tienda = await db.selectFrom('tiendas').selectAll().executeTakeFirstOrThrow();
    expect(tienda).toMatchObject({
      slug: 'dona-rosa',
      estado: 'prueba',
      pruebaHasta: null,
    });
    const usuario = await db.selectFrom('usuarios').selectAll().executeTakeFirstOrThrow();
    expect(usuario.emailVerificadoEn).toBeNull();
    expect(usuario.hashClave).toMatch(/^\$argon2id\$/);
  });

  it('no revela si el email ya existe: misma respuesta y aviso por email', async () => {
    const primera = await registrar(datos()).expect(201);
    const segunda = await registrar(datos({ slug: 'otra-tienda' })).expect(201);
    expect(segunda.body).toEqual(primera.body);
    expect(correo.enviados.at(-1)?.asunto).toBe('Ya tenés una cuenta en Mostry');
    expect(await db.selectFrom('tiendas').select('id').execute()).toHaveLength(1);
  });

  it('rechaza slugs ocupados, reservados o inválidos', async () => {
    await registrar(datos()).expect(201);
    const ocupado = await registrar(datos({ email: 'otro@test.com' }));
    expect(ocupado.status).toBe(409);
    // 1 + 1 + 3 = 5 registros: justo el límite por hora de una IP.
    for (const slug of ['admin', 'ab', 'con espacio']) {
      await registrar(datos({ email: 'x@test.com', slug })).expect(400);
    }
  });

  it('rechaza campos de más (mass assignment) y orígenes que no son el sitio', async () => {
    const res = await registrar(datos({ esAdmin: true }));
    expect(res.status).toBe(400);
    await registrar(datos(), origenTienda('dona-rosa')).expect(403);
    expect(correo.enviados).toHaveLength(0);
  });
});
