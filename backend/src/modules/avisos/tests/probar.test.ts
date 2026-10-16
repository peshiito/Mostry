import { beforeEach, describe, expect, it, vi } from 'vitest';
import { suscripcion } from '../../../test/avisos.js';
import { pedido, tiendaLista } from '../../../test/tiendaLista.js';
import { enviarAvisosPendientes } from '../../../worker/jobs/enviarAvisos.js';
import { transportePush } from '../transporte.js';

// Avisos 1: el botón de prueba y la red de seguridad del worker.
describe('avisos: prueba y worker', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;

  beforeEach(async () => {
    t = await tiendaLista();
    await t.panel.post('/panel/avisos/suscripciones', suscripcion(1)).expect(201);
  });

  it('el aviso de prueba llega solo a los teléfonos de quien lo pide', async () => {
    const enviar = vi.spyOn(transportePush, 'enviar').mockResolvedValue('ok');
    const r = (await t.panel.post('/panel/avisos/probar').expect(200)).body;
    expect(r).toEqual({ enviados: 1, telefonos: 1 });
    expect(enviar.mock.calls[0]![1]).toMatchObject({ url: '/panel', tag: 'prueba' });
  });

  it('el worker deja 20 s a la API y después manda lo que quedó', async () => {
    const enviar = vi.spyOn(transportePush, 'enviar').mockResolvedValue('ok');
    await t.comprador
      .post('/publico/pedidos', pedido(t.productos, { medialuna: 1 }))
      .expect(201);
    await enviarAvisosPendientes();
    expect(enviar).not.toHaveBeenCalled();
    await enviarAvisosPendientes(new Date(Date.now() + 30_000));
    expect(enviar).toHaveBeenCalledTimes(1);
  });
});
