import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { crearCuentaCompleta } from '../../../test/flujoAuth.js';
import { cargar, datosManual, enDias } from '../../../test/encargoManual.js';
import { panel } from '../../../test/panel.js';
import { tiendaLista } from '../../../test/tiendaLista.js';

// Encargos 3: reglas del encargo cargado a mano (el dueño manda, pero con límites).
describe('encargos cargados desde el panel: reglas', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;
  const codigo = async (extra: Record<string, unknown>) =>
    (await cargar(t, extra)).body.error?.codigo;

  beforeEach(async () => {
    t = await tiendaLista();
  });

  it('el dueño saltea anticipación y horario, pero no fechas pasadas ni muy lejanas', async () => {
    await cargar(t, { fechaEncargo: enDias(0.1) }).expect(201);
    expect((await cargar(t, { fechaEncargo: enDias(-1) })).status).toBe(400);
    expect((await cargar(t, { fechaEncargo: enDias(61) })).status).toBe(400);
  });

  it('solo productos que se encargan, y la seña no supera el total', async () => {
    const items = [{ productoId: t.productos.medialuna, cantidad: 2 }];
    expect(await codigo({ items })).toBe('producto_sin_encargo');
    expect(await codigo({ sena: { monto: 2800001, medio: 'transferencia' } })).toBe(
      'sena_mayor_al_total',
    );
  });

  it('otra tienda no usa productos ajenos; con encargos apagados, 403', async () => {
    const martin = await crearCuentaCompleta(t.app, t.correo, 'heladeria');
    const ajeno = panel(t.app, 'heladeria', martin.cookie);
    const res = await ajeno.post('/panel/encargos', datosManual(t));
    expect(res.body.error.codigo).toBe('producto_no_disponible');
    await db
      .updateTable('tiendas')
      .set({ usaEncargos: false })
      .where('slug', '=', 'dona-rosa')
      .execute();
    expect((await cargar(t)).status).toBe(403);
  });
});
