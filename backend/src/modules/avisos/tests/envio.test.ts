import { beforeEach, describe, expect, it, vi } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { suscripcion } from '../../../test/avisos.js';
import { cargar, enDias } from '../../../test/encargoManual.js';
import { subirComprobante } from '../../../test/comprobantes.js';
import { png } from '../../../test/imagenes.js';
import { pedido, tiendaLista } from '../../../test/tiendaLista.js';
import { enviarAvisos } from '../enviar.js';
import { transportePush } from '../transporte.js';

type Llamada = [unknown, { titulo: string; cuerpo: string; url: string; tag: string }];

// Avisos 1: pedido o encargo nuevo avisa al teléfono del comercio.
describe('avisos: envío de pedidos y encargos', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;
  let enviar: ReturnType<typeof vi.spyOn>;
  const avisos = () => (enviar.mock.calls as Llamada[]).map(([, p]) => p);

  beforeEach(async () => {
    t = await tiendaLista();
    enviar = vi.spyOn(transportePush, 'enviar').mockResolvedValue('ok');
    await t.panel.post('/panel/avisos/suscripciones', suscripcion(1)).expect(201);
  });

  it('un pedido nuevo avisa una sola vez, sin plata, dirección ni token', async () => {
    const creado = (
      await t.comprador
        .post('/publico/pedidos', pedido(t.productos, { medialuna: 2 }))
        .expect(201)
    ).body;
    await enviarAvisos();
    await enviarAvisos();
    const id = (await db.selectFrom('pedidos').select('id').executeTakeFirstOrThrow()).id;
    expect(avisos()).toEqual([
      expect.objectContaining({
        titulo: '🛍️ Nuevo pedido #1',
        cuerpo: 'Ana · retira en el local',
        url: `/panel/pedidos/${id}`,
        tag: `pedido-${id}`,
      }),
    ]);
    expect(JSON.stringify(avisos())).not.toMatch(new RegExp(`\\$|${creado.token}`));
  });

  it('un encargo avisa "por aceptar"; el cargado desde el panel no avisa', async () => {
    const datos = pedido(
      t.productos,
      { rogel: 1 },
      { tipo: 'encargo', fechaEncargo: enDias(3) },
    );
    await t.comprador.post('/publico/pedidos', datos).expect(201);
    await cargar(t).expect(201);
    await enviarAvisos();
    expect(avisos().map((a) => a.titulo)).toEqual(['🎂 Encargo por aceptar #1']);
  });

  it('el comprobante subido avisa para revisarlo', async () => {
    const { token } = (
      await t.comprador
        .post('/publico/pedidos', pedido(t.productos, { medialuna: 1 }))
        .expect(201)
    ).body;
    await subirComprobante(t.app, 'dona-rosa', token, await png()).expect(201);
    await enviarAvisos();
    expect(avisos().map((a) => a.titulo)).toEqual([
      '🛍️ Nuevo pedido #1',
      '🧾 Comprobante para revisar',
    ]);
  });
});
