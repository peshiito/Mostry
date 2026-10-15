import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { privadosBajo } from '../../../test/bucket.js';
import { idPedido } from '../../../test/comprobantes.js';
import { png } from '../../../test/imagenes.js';
import { tiendaLista } from '../../../test/tiendaLista.js';
import { crearTorta, encargoTorta, subirFoto } from '../../../test/tortaPersonalizada.js';
import { borrarFotosReferencia } from '../borrarFotosReferencia.js';

const DIA_MS = 86_400_000;
const fotos = () =>
  db.selectFrom('pedidoItems').select(['fotoClave', 'fotoBorrarEn']).execute();

// Encargos 2: la foto de referencia se borra 7 días después de cerrar el pedido.
describe('fotos de referencia: borrado', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;
  let id: number;

  beforeEach(async () => {
    t = await tiendaLista();
    const torta = await crearTorta(t);
    const creado = (
      await t.comprador.post('/publico/pedidos', encargoTorta(t, torta)).expect(201)
    ).body;
    id = await idPedido(creado.numero);
    const itemId = (await t.panel.get(`/panel/pedidos/${id}`)).body.items[0].id;
    await subirFoto(t.app, 'dona-rosa', creado.token, itemId, await png()).expect(201);
  });

  it('al cancelar se programa a 7 días y el job la borra cuando vence', async () => {
    await t.panel
      .post(`/panel/pedidos/${id}/cancelar`, { motivo: 'No llegamos' })
      .expect(200);
    const [f] = await fotos();
    expect((f!.fotoBorrarEn!.getTime() - Date.now()) / DIA_MS).toBeCloseTo(7, 1);
    expect(await borrarFotosReferencia()).toEqual({ borrados: 0, fallidos: 0 });
    expect(await borrarFotosReferencia(new Date(Date.now() + 8 * DIA_MS))).toEqual({
      borrados: 1,
      fallidos: 0,
    });
    expect(await fotos()).toEqual([{ fotoClave: null, fotoBorrarEn: null }]);
    expect(await privadosBajo('tiendas/')).toEqual([]);
  });

  it('al entregar también se programa a 7 días', async () => {
    await db.updateTable('tiendas').set({ senaPorcentaje: 0 }).execute();
    await db.updateTable('pedidos').set({ sena: 0, estado: 'listo_retirar' }).execute();
    await t.panel.post('/panel/caja/abrir', { montoApertura: 0 }).expect(201);
    await t.panel
      .post(`/panel/pedidos/${id}/estado`, {
        estado: 'entregado',
        medioCobro: 'efectivo',
      })
      .expect(200);
    const [f] = await fotos();
    expect((f!.fotoBorrarEn!.getTime() - Date.now()) / DIA_MS).toBeCloseTo(7, 1);
  });
});
