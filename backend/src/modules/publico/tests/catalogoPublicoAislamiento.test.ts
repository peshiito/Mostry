import { beforeEach, describe, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { appConCuenta } from '../../../test/appConCuenta.js';
import { crearCuentaCompleta } from '../../../test/flujoAuth.js';
import { panel } from '../../../test/panel.js';
import { publico } from '../../../test/publico.js';

describe('tienda pública: lo que no se ve', () => {
  let ctx: Awaited<ReturnType<typeof appConCuenta>>;

  beforeEach(async () => {
    ctx = await appConCuenta('dona-rosa');
  });

  it('un producto inactivo o de otra tienda da 404', async () => {
    const comprador = publico(ctx.app, 'dona-rosa');
    const inactivo = (
      await ctx.panel.post('/panel/productos', {
        nombre: 'Oculto',
        precio: 1,
        stock: 1,
        activo: false,
      })
    ).body.id;
    await comprador.get(`/publico/productos/${inactivo}`).expect(404);
    const martin = await crearCuentaCompleta(ctx.app, ctx.correo, 'heladeria');
    const heladeria = panel(ctx.app, 'heladeria', martin.cookie);
    const ajeno = (
      await heladeria.post('/panel/productos', { nombre: 'Pote', precio: 1, stock: 1 })
    ).body.id;
    await comprador.get(`/publico/productos/${ajeno}`).expect(404);
  });

  it('una tienda sin verificar no existe para el público; un subdominio inventado tampoco', async () => {
    await db.updateTable('tiendas').set({ pruebaHasta: null }).execute();
    await publico(ctx.app, 'dona-rosa').get('/publico/tienda').expect(404);
    await publico(ctx.app, 'no-existe').get('/publico/tienda').expect(404);
  });
});
