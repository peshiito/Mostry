import { beforeEach, describe, expect, it } from 'vitest';
import { crearCuentaCompleta } from '../../../test/flujoAuth.js';
import { panel } from '../../../test/panel.js';
import { tiendaLista } from '../../../test/tiendaLista.js';
import { paginaDePrueba } from './paginaDePrueba.js';

// "Armá tu página" (P1): borrador, publicar y lo que ve el comprador.
describe('página de la tienda', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;
  const borrador = (p: object) => t.panel.put('/panel/tienda/pagina/borrador', p);
  beforeEach(async () => {
    t = await tiendaLista();
  });

  it('el borrador no se ve hasta publicar; después sí', async () => {
    expect((await t.comprador.get('/publico/tienda')).body.pagina).toBeNull();
    await borrador(paginaDePrueba()).expect(200);
    expect((await t.comprador.get('/publico/tienda')).body.pagina).toBeNull();
    const pub = await t.panel.post('/panel/tienda/pagina/publicar').expect(200);
    expect(pub.body.version).toBe(1);
    const publica = (await t.comprador.get('/publico/tienda')).body.pagina;
    expect(publica).toEqual(paginaDePrueba());
  });

  it('publicar sin borrador avisa', async () => {
    await t.panel.post('/panel/tienda/pagina/publicar').expect(409);
  });

  it('guarda las versiones y se puede volver a una', async () => {
    await borrador(paginaDePrueba()).expect(200);
    await t.panel.post('/panel/tienda/pagina/publicar').expect(200);
    const otra = paginaDePrueba();
    otra.bloques = otra.bloques.slice(0, 1);
    await borrador(otra).expect(200);
    await t.panel.post('/panel/tienda/pagina/publicar').expect(200);
    const versiones = (await t.panel.get('/panel/tienda/pagina/versiones')).body;
    expect(versiones).toHaveLength(2);
    const vieja = versiones[1].id;
    const r = await t.panel.post(`/panel/tienda/pagina/versiones/${vieja}/restaurar`);
    expect(r.body.borrador.bloques).toHaveLength(paginaDePrueba().bloques.length);
  });

  it('una tienda no ve ni restaura versiones de otra', async () => {
    await borrador(paginaDePrueba()).expect(200);
    await t.panel.post('/panel/tienda/pagina/publicar').expect(200);
    const [v] = (await t.panel.get('/panel/tienda/pagina/versiones')).body;
    const martin = await crearCuentaCompleta(t.app, t.correo, 'heladeria');
    const otra = panel(t.app, 'heladeria', martin.cookie);
    expect((await otra.get('/panel/tienda/pagina/versiones')).body).toEqual([]);
    await otra.post(`/panel/tienda/pagina/versiones/${v.id}/restaurar`).expect(404);
  });
});
