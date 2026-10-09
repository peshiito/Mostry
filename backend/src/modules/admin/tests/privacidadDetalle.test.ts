import { describe, expect, it } from 'vitest';
import { crearAdminLogueado } from '../../../test/adminCompleto.js';
import { idDeTienda } from '../../../test/soporteListo.js';
import { tiendaLista } from '../../../test/tiendaLista.js';

// El admin ve suscripción y contacto de cada tienda, nunca su alias de cobro
// ni cuántos pedidos tuvo (privacidad del comercio).
describe('admin: el detalle de una tienda no muestra datos del negocio', () => {
  it('sin alias, titular, logo interno ni contador de pedidos', async () => {
    const t = await tiendaLista();
    const admin = await crearAdminLogueado(t.app);
    const { body } = await admin
      .get(`/admin/tiendas/${await idDeTienda('dona-rosa')}`)
      .expect(200);
    for (const campo of ['alias', 'titularAlias', 'ultimoNumeroPedido', 'logoClave']) {
      expect(body.tienda).not.toHaveProperty(campo);
    }
    expect(body.conteos).not.toHaveProperty('pedidos');
    expect(body.tienda).toMatchObject({ slug: 'dona-rosa' });
    expect(body.tienda).toHaveProperty('whatsapp');
  });
});
