import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { crearCuentaCompleta } from '../../../test/flujoAuth.js';
import { clubListo } from '../../../test/clubListo.js';
import { ORIGEN_ADMIN } from '../../../test/origenes.js';
import { origenTienda } from '../../../test/sesionHttp.js';

// La cuenta del club es otro tipo de usuario: su cookie no abre nada del panel
// ni del admin, y la del panel no abre el club.
describe('Club · aislamiento con el panel y el admin', () => {
  let ctx: Awaited<ReturnType<typeof clubListo>>;
  let cookiePanel: string;

  beforeEach(async () => {
    ctx = await clubListo();
    cookiePanel = (await crearCuentaCompleta(ctx.app, ctx.correo, 'dona-rosa')).cookie;
  });

  it('la cookie del club no sirve en el panel ni en el admin', async () => {
    const cookieClub = ctx.ana.cookie;
    // Aunque se la renombre como la del panel, el token no es una sesión de usuarios.
    const disfrazada = cookieClub.replace('__Host-mostry_club', '__Host-mostry_sesion');
    for (const cookie of [cookieClub, disfrazada]) {
      await request(ctx.app)
        .get('/panel/tienda/config')
        .set('Origin', origenTienda('dona-rosa'))
        .set('Cookie', cookie)
        .expect(401);
    }
    await request(ctx.app)
      .get('/admin/tiendas')
      .set('Origin', ORIGEN_ADMIN)
      .set('Cookie', cookieClub.replace('mostry_club', 'mostry_admin'))
      .expect(401);
  });

  it('la cookie del panel no abre el club', async () => {
    await ctx.club(cookiePanel).get('/yo').expect(401);
    const disfrazada = cookiePanel.replace('__Host-mostry_sesion', '__Host-mostry_club');
    const res = await ctx.club(disfrazada).get('/qr');
    expect(res.status).toBe(401);
  });
});
