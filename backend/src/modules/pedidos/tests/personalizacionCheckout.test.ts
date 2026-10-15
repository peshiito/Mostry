import { beforeEach, describe, expect, it } from 'vitest';
import { idPedido } from '../../../test/comprobantes.js';
import { tiendaLista } from '../../../test/tiendaLista.js';
import { crearTorta, encargoTorta } from '../../../test/tortaPersonalizada.js';

// Encargos 2: lo que pide personalización se encarga diciendo cómo se quiere.
describe('checkout: personalización', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;
  let torta: number;
  const codigo = async (datos: object) =>
    (await t.comprador.post('/publico/pedidos', datos)).body.error?.codigo;

  beforeEach(async () => {
    t = await tiendaLista();
    torta = await crearTorta(t);
  });

  it('se guarda con el ítem y el panel la ve (escapada, como texto)', async () => {
    const texto = 'Feliz cumple <b>Juan</b>, de chocolate';
    const creado = (
      await t.comprador
        .post('/publico/pedidos', encargoTorta(t, torta, texto))
        .expect(201)
    ).body;
    const p = (await t.panel.get(`/panel/pedidos/${await idPedido(creado.numero)}`)).body;
    expect(p.items).toEqual([
      expect.objectContaining({
        id: expect.any(Number),
        nombre: 'Torta de cumple',
        personalizacion: texto,
        tieneFoto: false,
      }),
    ]);
    const seguimiento = (await t.comprador.get(`/publico/pedidos/${creado.token}`)).body;
    expect(seguimiento.items[0]).toMatchObject({
      personalizacion: texto,
      tieneFoto: false,
    });
  });

  it('sin decir cómo la quiere, no se puede encargar', async () => {
    const items = [{ productoId: torta, cantidad: 1 }];
    expect(await codigo({ ...encargoTorta(t, torta), items })).toBe(
      'falta_personalizacion',
    );
    expect(await codigo(encargoTorta(t, torta, '  '))).toBe('falta_personalizacion');
  });
});
