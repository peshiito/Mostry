import { describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { clubListo, datosCliente } from '../../../test/clubListo.js';
import { limpiarClub } from '../../../worker/jobs/limpiarClub.js';

describe('Club · limpieza de registros sin verificar', () => {
  it('borra los que tienen más de un día y deja los verificados', async () => {
    const ctx = await clubListo();
    await ctx
      .club('')
      .post('/registro', { ...datosCliente({ email: 'tibio@test.com' }) });
    const manana = new Date(Date.now() + 25 * 60 * 60 * 1000);
    const r = await limpiarClub(manana);
    expect(r.sinVerificar).toBe(1);
    const emails = (await db.selectFrom('clientes').select('email').execute()).map(
      (c) => c.email,
    );
    expect(emails).toEqual(['ana@test.com']);
  });
});
