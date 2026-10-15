import { beforeEach, describe, expect, it } from 'vitest';
import { pedido, tiendaLista } from '../../../test/tiendaLista.js';
import { crearTorta, encargoTorta } from '../../../test/tortaPersonalizada.js';

// Encargos 2: lo que pide personalización se encarga diciendo cómo se quiere.
describe('checkout: personalización no admitida', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;
  let torta: number;
  const codigo = async (datos: object) =>
    (await t.comprador.post('/publico/pedidos', datos)).body.error?.codigo;

  beforeEach(async () => {
    t = await tiendaLista();
    torta = await crearTorta(t);
  });

  it('no se personaliza lo que no lo pide, ni una compra al toque', async () => {
    const datos = encargoTorta(t, torta);
    expect(
      await codigo({
        ...datos,
        items: [
          {
            productoId: t.productos.rogel,
            cantidad: 1,
            personalizacion: 'Con frutillas',
          },
        ],
        totalEsperado: 2800000,
      }),
    ).toBe('personalizacion_no_admitida');
    expect(
      await codigo({
        ...pedido(t.productos, { medialuna: 1 }),
        items: [
          { productoId: t.productos.medialuna, cantidad: 1, personalizacion: 'Tibias' },
        ],
      }),
    ).toBe('personalizacion_no_admitida');
  });
});
