import { beforeEach, describe, expect, it } from 'vitest';
import { idPedido } from '../../../test/comprobantes.js';
import { crearCuentaCompleta } from '../../../test/flujoAuth.js';
import { maliciosos, png } from '../../../test/imagenes.js';
import { tiendaLista } from '../../../test/tiendaLista.js';
import { crearTorta, encargoTorta, subirFoto } from '../../../test/tortaPersonalizada.js';

// Encargos 2: foto de referencia del comprador, privada y solo mientras se decide.
describe('encargos: foto de referencia', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;
  let e: { token: string; id: number; itemId: number };

  beforeEach(async () => {
    t = await tiendaLista();
    const torta = await crearTorta(t);
    const creado = (
      await t.comprador.post('/publico/pedidos', encargoTorta(t, torta)).expect(201)
    ).body;
    const id = await idPedido(creado.numero);
    const p = (await t.panel.get(`/panel/pedidos/${id}`)).body;
    e = { token: creado.token, id, itemId: p.items[0].id };
  });

  it('se sube, queda privada y el panel la ve con URL firmada de 5 min', async () => {
    await subirFoto(t.app, 'dona-rosa', e.token, e.itemId, await png()).expect(201);
    const p = (await t.panel.get(`/panel/pedidos/${e.id}`)).body;
    expect(p.items[0].tieneFoto).toBe(true);
    const { url } = (
      await t.panel.get(`/panel/pedidos/${e.id}/items/${e.itemId}/foto`).expect(200)
    ).body;
    expect(url).toContain('X-Amz-Expires=300');
    const r = await fetch(url);
    expect(r.status).toBe(200);
    expect(r.headers.get('content-type')).toBe('image/webp');
    expect(r.headers.get('content-disposition')).toMatch(/^inline;/);
  });

  it('rechaza archivos que no son imágenes reales', async () => {
    const res = await subirFoto(
      t.app,
      'dona-rosa',
      e.token,
      e.itemId,
      maliciosos.svgConScript,
    );
    expect(res.status).toBe(400);
  });

  it('no se sube con un token ajeno ni a un ítem de otro pedido', async () => {
    await crearCuentaCompleta(t.app, t.correo, 'heladeria');
    await subirFoto(t.app, 'heladeria', e.token, e.itemId, await png()).expect(404);
    await subirFoto(t.app, 'dona-rosa', e.token, e.itemId + 999, await png()).expect(404);
  });

  it('una vez aceptado el encargo ya no se cambia la foto', async () => {
    await t.panel.post(`/panel/pedidos/${e.id}/aceptar`).expect(200);
    const res = await subirFoto(t.app, 'dona-rosa', e.token, e.itemId, await png());
    expect(res.status).toBe(409);
  });
});
