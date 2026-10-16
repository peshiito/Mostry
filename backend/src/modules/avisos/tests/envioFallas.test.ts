import { beforeEach, describe, expect, it, vi } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { suscripcion } from '../../../test/avisos.js';
import { pedido, tiendaLista } from '../../../test/tiendaLista.js';
import { enviarAvisos } from '../enviar.js';
import { transportePush } from '../transporte.js';

const MIN = 60_000;
const pendientes = () =>
  db.selectFrom('avisosPush').select('id').where('enviadoEn', 'is', null).execute();

// Avisos 1: teléfonos que ya no existen, fallas pasajeras y horario de silencio.
describe('avisos: fallas y silencio', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;
  const comprar = () =>
    t.comprador
      .post('/publico/pedidos', pedido(t.productos, { medialuna: 1 }))
      .expect(201);

  beforeEach(async () => {
    t = await tiendaLista();
    await t.panel.post('/panel/avisos/suscripciones', suscripcion(1)).expect(201);
  });

  it('si el teléfono ya no existe (410) se borra su suscripción', async () => {
    vi.spyOn(transportePush, 'enviar').mockResolvedValue('no_existe');
    await comprar();
    await enviarAvisos();
    expect((await t.panel.get('/panel/avisos')).body.telefonos).toBe(0);
    expect(await pendientes()).toEqual([]);
  });

  it('una falla pasajera se reintenta (no antes de 5 min) y llega', async () => {
    const enviar = vi
      .spyOn(transportePush, 'enviar')
      .mockRejectedValueOnce(new Error('red'));
    enviar.mockResolvedValue('ok');
    await comprar();
    await enviarAvisos();
    expect(await pendientes()).toHaveLength(1);
    await enviarAvisos();
    expect(enviar).toHaveBeenCalledTimes(1);
    await enviarAvisos({ ahora: new Date(Date.now() + 6 * MIN) });
    expect(enviar).toHaveBeenCalledTimes(2);
    expect(await pendientes()).toEqual([]);
  });

  it('en el horario de silencio llega sin sonido', async () => {
    const enviar = vi.spyOn(transportePush, 'enviar').mockResolvedValue('ok');
    await t.panel
      .put('/panel/avisos/silencio', { desde: '00:00', hasta: '23:59' })
      .expect(200);
    await comprar();
    await enviarAvisos();
    expect(enviar.mock.calls[0]![1]).toMatchObject({ silencioso: true });
  });
});
