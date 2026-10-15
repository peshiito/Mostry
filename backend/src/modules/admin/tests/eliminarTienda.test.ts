import { sql } from 'kysely';
import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { crearAdminLogueado } from '../../../test/adminCompleto.js';
import { appConCuenta } from '../../../test/appConCuenta.js';
import { CLAVE, registrarYVerificar } from '../../../test/flujoAuth.js';
import {
  TABLAS_DE_TIENDA,
  TABLAS_QUE_SOBREVIVEN,
} from '../../tiendas/borrado/tablasDeTienda.js';

const contar = async (tabla: string, id: number) =>
  Number(
    (
      await sql<{
        n: number;
      }>`SELECT COUNT(*) AS n FROM ${sql.table(tabla)} WHERE tienda_id = ${id}`.execute(
        db,
      )
    ).rows[0]!.n,
  );

describe('admin: eliminar una tienda', () => {
  let ctx: Awaited<ReturnType<typeof appConCuenta>>;
  let admin: Awaited<ReturnType<typeof crearAdminLogueado>>;
  let id: number;
  const borrar = (body: object) => admin.delete(`/admin/tiendas/${id}`).send(body);

  beforeEach(async () => {
    ctx = await appConCuenta('dona-rosa');
    admin = await crearAdminLogueado(ctx.app);
    id = (await ctx.panel.get('/panel/tienda/config')).body.id;
    await ctx.panel
      .post('/panel/productos', { nombre: 'Pan', precio: 100000 })
      .expect(201);
    await admin
      .post(`/admin/tiendas/${id}/pagos`, { monto: 1000000, pagadoEn: '2026-10-01' })
      .expect(201);
  });

  it('solo se elimina suspendida, con el link y la contraseña correctos', async () => {
    const activa = await borrar({ slugConfirmado: 'dona-rosa', claveAdmin: CLAVE });
    expect(activa.body.error.codigo).toBe('tienda_en_uso');
    await admin.post(`/admin/tiendas/${id}/suspender`, { motivo: 'No pagó' }).expect(200);
    await borrar({ slugConfirmado: 'otra', claveAdmin: CLAVE }).expect(403);
    await borrar({ slugConfirmado: 'dona-rosa', claveAdmin: 'mala' }).expect(403);
  });

  it('borra todo, guarda el resumen y deja libres el email y el link', async () => {
    await admin.post(`/admin/tiendas/${id}/suspender`, { motivo: 'No pagó' }).expect(200);
    await borrar({ slugConfirmado: 'dona-rosa', claveAdmin: CLAVE }).expect(200);
    for (const tabla of TABLAS_DE_TIENDA) expect(await contar(tabla, id)).toBe(0);
    const resumen = await db
      .selectFrom('tiendasEliminadas')
      .selectAll()
      .executeTakeFirstOrThrow();
    expect(resumen).toMatchObject({ slug: 'dona-rosa', totalPagado: 1000000 });
    expect(JSON.stringify(resumen)).not.toContain(ctx.cuenta.email);
    await registrarYVerificar(ctx.app, ctx.correo, 'dona-rosa'); // mismo email y link
  });

  it('ninguna tabla con tienda_id queda afuera del borrado', async () => {
    const { rows } = await sql<{ t: string }>`
      SELECT DISTINCT table_name AS t FROM information_schema.columns
      WHERE table_schema = DATABASE() AND column_name = 'tienda_id'`.execute(db);
    expect(rows.map((r) => r.t).sort()).toEqual(
      [...TABLAS_DE_TIENDA, ...TABLAS_QUE_SOBREVIVEN].sort(),
    );
  });
});
