import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { CLAVE } from '../../../test/flujoAuth.js';
import { clubListo } from '../../../test/clubListo.js';
import { cookieDe, origenTienda } from '../../../test/sesionHttp.js';

describe('Club · ingreso y recuperar', () => {
  let ctx: Awaited<ReturnType<typeof clubListo>>;
  beforeEach(async () => {
    ctx = await clubListo();
  });

  it('entra con su clave, ve sus datos y sale', async () => {
    const res = await ctx
      .club('')
      .post('/login', { email: 'ana@test.com', clave: CLAVE });
    expect(res.status).toBe(200);
    const cookie = cookieDe(res);
    const yo = await ctx.club(cookie).get('/yo').expect(200);
    expect(yo.body.cliente).toEqual({
      email: 'ana@test.com',
      nombre: 'Ana',
      whatsapp: '5491155551234',
      direccion: null,
    });
    await ctx.club(cookie).post('/logout').expect(204);
    await ctx.club(cookie).get('/yo').expect(401);
  });

  it('clave mala o email ajeno: el mismo error', async () => {
    const mala = await ctx.club('').post('/login', { email: 'ana@test.com', clave: 'x' });
    const ajeno = await ctx
      .club('')
      .post('/login', { email: 'no@test.com', clave: CLAVE });
    expect(mala.status).toBe(401);
    expect(ajeno.body).toEqual(mala.body);
  });

  it('el registro y el ingreso se hacen solo desde mostry.com.ar', async () => {
    await request(ctx.app)
      .post('/club/login')
      .set('Origin', origenTienda('dona-rosa'))
      .send({ email: 'ana@test.com', clave: CLAVE })
      .expect(403);
  });

  it('recupera la clave con el código y cierra las sesiones viejas', async () => {
    await ctx.club('').post('/recuperar', { email: 'ana@test.com' }).expect(202);
    const codigo = ctx.correo.ultimoCodigo('ana@test.com');
    const claveNueva = 'otra-clave-bien-larga';
    await ctx
      .club('')
      .post('/recuperar/confirmar', { email: 'ana@test.com', codigo, claveNueva })
      .expect(200);
    await ctx.club().get('/yo').expect(401);
    await ctx
      .club('')
      .post('/login', { email: 'ana@test.com', clave: claveNueva })
      .expect(200);
  });

  it('pedir recuperar un email que no existe responde igual y no manda nada', async () => {
    const antes = ctx.correo.enviados.length;
    await ctx.club('').post('/recuperar', { email: 'nadie@test.com' }).expect(202);
    expect(ctx.correo.enviados).toHaveLength(antes);
  });
});
