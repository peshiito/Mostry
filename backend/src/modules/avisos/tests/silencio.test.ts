import { beforeEach, describe, expect, it } from 'vitest';
import { tiendaLista } from '../../../test/tiendaLista.js';

// Avisos 1: en el horario de silencio los avisos llegan sin sonido.
describe('avisos: horario de silencio', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;
  const estado = async () => (await t.panel.get('/panel/avisos').expect(200)).body;

  beforeEach(async () => {
    t = await tiendaLista();
  });

  it('horario de silencio: se guarda, se borra y se valida', async () => {
    await t.panel
      .put('/panel/avisos/silencio', { desde: '23:00', hasta: '07:00' })
      .expect(200);
    expect((await estado()).silencio).toEqual({ desde: '23:00', hasta: '07:00' });
    await t.panel.put('/panel/avisos/silencio', { desde: null, hasta: null }).expect(200);
    expect((await estado()).silencio).toEqual({ desde: null, hasta: null });
    await t.panel
      .put('/panel/avisos/silencio', { desde: '25:00', hasta: '07:00' })
      .expect(400);
    await t.panel
      .put('/panel/avisos/silencio', { desde: '23:00', hasta: null })
      .expect(400);
  });
});
