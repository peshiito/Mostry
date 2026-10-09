import { describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { soporteListo } from '../../../test/soporteListo.js';

const aliasDeRosa = async () =>
  (
    await db
      .selectFrom('tiendas')
      .select('alias')
      .where('slug', '=', 'dona-rosa')
      .executeTakeFirstOrThrow()
  ).alias;

// En modo soporte, editar los datos de la tienda nunca muestra ni cambia el cobro.
describe('modo soporte: datos de la tienda sin cobro', () => {
  it('editar devuelve sin alias y no deja tocar el alias', async () => {
    const { admin, base } = await soporteListo();
    const antes = await aliasDeRosa();
    const { body } = await admin
      .patch(`${base}/tienda/config`, { nombre: 'Doña Rosa Facturas' })
      .expect(200);
    expect(body.nombre).toBe('Doña Rosa Facturas');
    expect(body).not.toHaveProperty('alias');
    expect(body).not.toHaveProperty('titularAlias');
    await admin.patch(`${base}/tienda/config`, { alias: 'robado.alias' }).expect(400);
    expect(await aliasDeRosa()).toBe(antes);
  });
});
