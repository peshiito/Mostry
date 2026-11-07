import { beforeEach, describe, expect, it } from 'vitest';
import { crearCuentaCompleta } from '../../../test/flujoAuth.js';
import { db } from '../../../shared/db/db.js';
import { comoTiendaId } from '../../../shared/db/tiendaId.js';
import { publico } from '../../../test/publico.js';
import { tiendaLista } from '../../../test/tiendaLista.js';
import { firmarVistaBorrador } from '../pagina/vistaBorrador.js';
import { paginaDePrueba } from './paginaDePrueba.js';

// "Mirala en tu celu": el link firmado muestra el borrador solo en su tienda.
describe('página: vista del borrador', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;
  const pagina = (token?: string) =>
    t.comprador.get(`/publico/tienda${token ? `?borrador=${token}` : ''}`);
  beforeEach(async () => {
    t = await tiendaLista();
    await t.panel.put('/panel/tienda/pagina/borrador', paginaDePrueba()).expect(200);
  });

  it('con el token se ve el borrador; sin él, lo publicado', async () => {
    const r = await t.panel.post('/panel/tienda/pagina/vista-previa').expect(200);
    expect(new Date(r.body.vence).getTime()).toBeGreaterThan(Date.now());
    const con = (await pagina(r.body.token)).body;
    expect(con.vistaBorrador).toBe(true);
    expect(con.pagina).toEqual(paginaDePrueba());
    const sin = (await pagina()).body;
    expect(sin.pagina).toBeNull();
    expect(sin.vistaBorrador).toBeUndefined();
  });

  it('un token vencido, alterado, mal formado o de otra tienda no muestra nada', async () => {
    const { token } = (await t.panel.post('/panel/tienda/pagina/vista-previa')).body;
    const { id } = await db
      .selectFrom('tiendas')
      .select('id')
      .where('slug', '=', 'dona-rosa')
      .executeTakeFirstOrThrow();
    const tiendaId = comoTiendaId(id);
    const vencido = firmarVistaBorrador(tiendaId, Date.now() - 25 * 3600_000).token;
    const alterado = `${token.slice(0, -1)}${token.endsWith('0') ? '1' : '0'}`;
    for (const malo of [vencido, alterado, 'nada', `${token}x`]) {
      const b = (await pagina(encodeURIComponent(malo))).body;
      expect(b.pagina).toBeNull();
      expect(b.vistaBorrador).toBeUndefined();
    }
    await crearCuentaCompleta(t.app, t.correo, 'heladeria');
    const otra = (
      await publico(t.app, 'heladeria').get(`/publico/tienda?borrador=${token}`)
    ).body;
    expect(otra.vistaBorrador).toBeUndefined();
  });
});
