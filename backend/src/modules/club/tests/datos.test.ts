import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { CLAVE } from '../../../test/flujoAuth.js';
import { clubListo } from '../../../test/clubListo.js';

describe('Club · mis datos y borrar la cuenta', () => {
  let ctx: Awaited<ReturnType<typeof clubListo>>;
  beforeEach(async () => {
    ctx = await clubListo();
  });

  it('edita nombre, WhatsApp y dirección (y la puede vaciar)', async () => {
    const res = await ctx
      .club()
      .patch('/datos', { nombre: 'Ana María', direccion: 'Mitre 123' })
      .expect(200);
    expect(res.body.cliente).toMatchObject({
      nombre: 'Ana María',
      direccion: 'Mitre 123',
    });
    const vacia = await ctx.club().patch('/datos', { direccion: '' }).expect(200);
    expect(vacia.body.cliente.direccion).toBeNull();
  });

  it('no deja tocar el email ni campos internos', async () => {
    await ctx.club().patch('/datos', { email: 'otra@test.com' }).expect(400);
    await ctx.club().patch('/datos', { activo: false }).expect(400);
    await ctx.club().patch('/datos', {}).expect(400);
  });

  it('borrar pide la clave y después no queda nada', async () => {
    await ctx.club().get('/qr').expect(200);
    await ctx.club().delete('/cuenta', { clave: 'equivocada' }).expect(403);
    const res = await ctx.club().delete('/cuenta', { clave: CLAVE }).expect(204);
    expect(String(res.headers['set-cookie'])).toMatch(/__Host-mostry_club=;/);
    for (const tabla of [
      'clientes',
      'sesionesClub',
      'codigosClub',
      'codigosEmailClub',
    ] as const)
      expect(await db.selectFrom(tabla).select('id').execute()).toHaveLength(0);
    await ctx
      .club('')
      .post('/login', { email: 'ana@test.com', clave: CLAVE })
      .expect(401);
    expect(ctx.correo.enviados.at(-1)?.asunto).toBe('Borraste tu cuenta del Club Mostry');
  });
});
