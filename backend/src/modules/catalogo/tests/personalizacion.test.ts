import { beforeEach, describe, expect, it } from 'vitest';
import { crearTorta } from '../../../test/tortaPersonalizada.js';
import { tiendaLista } from '../../../test/tiendaLista.js';

// Encargos 2: un producto puede pedir personalización (solo se encarga).
describe('catálogo: productos que se personalizan', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;

  beforeEach(async () => {
    t = await tiendaLista();
  });

  it('pedir personalización prende el encargo y la vidriera muestra la indicación', async () => {
    const id = await crearTorta(t);
    const panel = (await t.panel.get(`/panel/productos/${id}`)).body;
    expect(panel).toMatchObject({
      pidePersonalizacion: true,
      aceptaEncargo: true,
      indicacionPersonalizacion: 'Contanos el texto, el sabor y el relleno',
    });
    const vidriera = (await t.comprador.get(`/publico/productos/${id}`)).body;
    expect(vidriera).toMatchObject({
      pidePersonalizacion: true,
      indicacionPersonalizacion: 'Contanos el texto, el sabor y el relleno',
    });
  });

  it('apagar el encargo apaga la personalización (no se podría pedir)', async () => {
    const id = await crearTorta(t);
    const res = await t.panel
      .patch(`/panel/productos/${id}`, { aceptaEncargo: false })
      .expect(200);
    expect(res.body).toMatchObject({ aceptaEncargo: false, pidePersonalizacion: false });
  });

  it('prender la personalización en la edición también prende el encargo', async () => {
    const res = await t.panel
      .patch(`/panel/productos/${t.productos.medialuna}`, { pidePersonalizacion: true })
      .expect(200);
    expect(res.body).toMatchObject({ aceptaEncargo: true, pidePersonalizacion: true });
  });
});
