import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { enArgentina } from '../../../shared/utils/horaArgentina.js';
import { appConCuenta } from '../../../test/appConCuenta.js';
import { crearCuentaCompleta } from '../../../test/flujoAuth.js';
import { panel } from '../../../test/panel.js';
import { tiendasRepo } from '../../tiendas/tiendas.repository.js';
import { cargarAgenda } from '../repositorios/agenda.repository.js';

const semana = [{ diaSemana: 1, abre: '07:00', cierra: '24:00' }];

describe('horarios: aislamiento y 24:00', () => {
  let ctx: Awaited<ReturnType<typeof appConCuenta>>;
  let heladeria: ReturnType<typeof panel>;

  beforeEach(async () => {
    ctx = await appConCuenta('dona-rosa');
    const martin = await crearCuentaCompleta(ctx.app, ctx.correo, 'heladeria');
    heladeria = panel(ctx.app, 'heladeria', martin.cookie);
  });

  it('acepta 24:00 como cierre y reemplazar la semana de B no toca la de A', async () => {
    await ctx.panel.put('/panel/horarios', { tramos: semana }).expect(200);
    await heladeria.put('/panel/horarios', { tramos: [] }).expect(200);
    expect((await ctx.panel.get('/panel/horarios')).body).toEqual(semana);
    await ctx.panel
      .put('/panel/horarios', {
        tramos: [{ diaSemana: 1, abre: '24:00', cierra: '24:00' }],
      })
      .expect(400);
  });

  it('un feriado de otra tienda no cierra la mía', async () => {
    const hoy = enArgentina(new Date()).fecha;
    await heladeria.post('/panel/feriados', { fecha: hoy }).expect(201);
    const rosa = (await tiendasRepo.buscarPorSlug('dona-rosa'))!;
    expect((await cargarAgenda(rosa.id)).feriados.has(hoy)).toBe(false);
    expect(await db.selectFrom('feriados').select('id').execute()).toHaveLength(1);
  });
});
