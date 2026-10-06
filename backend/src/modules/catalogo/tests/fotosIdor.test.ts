import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { appConCuenta } from '../../../test/appConCuenta.js';
import { crearCuentaCompleta } from '../../../test/flujoAuth.js';
import { descargar, png } from '../../../test/imagenes.js';
import { panel } from '../../../test/panel.js';

describe('fotos: IDOR al borrar, reordenar y listar', () => {
  let ctx: Awaited<ReturnType<typeof appConCuenta>>;
  let prodA: number;
  let foto: { id: number; grande: string; chica: string };

  beforeEach(async () => {
    ctx = await appConCuenta('dona-rosa');
    prodA = (
      await ctx.panel.post('/panel/productos', {
        nombre: 'Medialuna',
        precio: 1,
        stock: 1,
      })
    ).body.id;
    foto = (
      await ctx.panel
        .subir('post', `/panel/productos/${prodA}/fotos`, 'foto', await png())
        .expect(201)
    ).body;
  });
  const sigueIntacta = async () => {
    expect(
      await db
        .selectFrom('productoFotos')
        .select('id')
        .where('id', '=', foto.id)
        .execute(),
    ).toHaveLength(1);
    expect((await descargar(foto.grande)).status).toBe(200);
  };

  it('otra tienda no puede borrar, reordenar ni listar las fotos', async () => {
    const martin = await crearCuentaCompleta(ctx.app, ctx.correo, 'heladeria');
    const ajeno = panel(ctx.app, 'heladeria', martin.cookie);
    await ajeno.delete(`/panel/productos/${prodA}/fotos/${foto.id}`).expect(404);
    await ajeno
      .put(`/panel/productos/${prodA}/fotos/orden`, { ids: [foto.id] })
      .expect(404);
    await ajeno.get(`/panel/productos/${prodA}/fotos`).expect(404);
    await sigueIntacta();
  });

  it('no se puede borrar ni ordenar una foto "a través" de otro producto propio', async () => {
    const prodB = (
      await ctx.panel.post('/panel/productos', {
        nombre: 'Vigilante',
        precio: 1,
        stock: 1,
      })
    ).body.id;
    await ctx.panel.delete(`/panel/productos/${prodB}/fotos/${foto.id}`).expect(404);
    await ctx.panel
      .put(`/panel/productos/${prodB}/fotos/orden`, { ids: [foto.id] })
      .expect(400);
    await sigueIntacta();
  });

  it('borrar elimina los dos tamaños del bucket', async () => {
    await ctx.panel.delete(`/panel/productos/${prodA}/fotos/${foto.id}`).expect(204);
    expect((await descargar(foto.grande)).status).not.toBe(200);
    expect((await descargar(foto.chica)).status).not.toBe(200);
  });
});
