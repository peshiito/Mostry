import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { limpiarClub } from '../../../worker/jobs/limpiarClub.js';
import { clubListo, registrarCliente } from '../../../test/clubListo.js';
import { ALFABETO_QR, VENTANA_MS } from '../qr/codigoQr.js';
import { clienteDelCodigo, qrDelCliente } from '../qr/qr.service.js';

const T0 = 1_000 * VENTANA_MS; // justo al empezar una ventana
const MIN = 60 * 1000;

describe('Club · QR que rota', () => {
  let ctx: Awaited<ReturnType<typeof clubListo>>;
  let anaId: number;
  beforeEach(async () => {
    ctx = await clubListo();
    anaId = (await db.selectFrom('clientes').select('id').executeTakeFirstOrThrow()).id;
  });

  it('GET /club/qr da un código de 6 caracteres legibles y cuándo cambia', async () => {
    const res = await ctx.club().get('/qr').expect(200);
    expect(res.body.codigo).toMatch(new RegExp(`^[${ALFABETO_QR}]{6}$`));
    expect(res.body.quedanMs).toBeGreaterThan(0);
    expect(res.body.quedanMs).toBeLessThanOrEqual(5 * MIN);
    expect(res.headers['cache-control']).toBe('no-store');
    await ctx.club('').get('/qr').expect(401);
  });

  it('es el mismo dentro de la ventana y cambia en la siguiente', async () => {
    const a = await qrDelCliente(anaId, T0 + MIN);
    const b = await qrDelCliente(anaId, T0 + 4 * MIN);
    const c = await qrDelCliente(anaId, T0 + VENTANA_MS + MIN);
    expect(b.codigo).toBe(a.codigo);
    expect(b.venceEn).toBe(a.venceEn);
    expect(c.codigo).not.toBe(a.codigo);
  });

  it('el anterior sirve 1 minuto después de rotar y después no', async () => {
    const { codigo } = await qrDelCliente(anaId, T0);
    const fin = T0 + VENTANA_MS;
    expect(await clienteDelCodigo(codigo, new Date(fin + 30_000))).toBe(anaId);
    expect(await clienteDelCodigo(codigo.toLowerCase(), new Date(fin))).toBe(anaId);
    expect(await clienteDelCodigo(codigo, new Date(fin + MIN))).toBeUndefined();
    expect(await clienteDelCodigo('ZZZZZZ', new Date(T0))).toBeUndefined();
  });

  it('cada cliente tiene su código, y la limpieza borra los vencidos', async () => {
    await registrarCliente(ctx.app, ctx.correo, { email: 'beto@test.com' });
    const ids = (await db.selectFrom('clientes').select('id').execute()).map((c) => c.id);
    const [a, b] = await Promise.all(ids.map((id) => qrDelCliente(id, T0)));
    expect(a!.codigo).not.toBe(b!.codigo);
    const r = await limpiarClub(new Date(T0 + VENTANA_MS + MIN));
    expect(r.qr).toBe(2);
    expect(await db.selectFrom('codigosClub').select('id').execute()).toHaveLength(0);
  });
});
