import { expect, it } from 'vitest';
import { appConCuenta } from '../../../test/appConCuenta.js';
import { crearCuentaCompleta } from '../../../test/flujoAuth.js';
import { png } from '../../../test/imagenes.js';
import { panel } from '../../../test/panel.js';

const reporte = {
  pantalla: 'productos',
  descripcion: 'No me deja guardar la foto del producto.',
};

// Aislamiento (4.1): los reportes de una tienda no se ven ni se tocan desde otra.
it('otra tienda no ve ni toca los reportes ajenos', async () => {
  const ctx = await appConCuenta();
  const { body } = await ctx.panel.post('/panel/reportes', reporte).expect(201);
  const otra = await crearCuentaCompleta(ctx.app, ctx.correo, 'heladeria');
  const ajeno = panel(ctx.app, 'heladeria', otra.cookie);
  expect((await ajeno.get('/panel/reportes').expect(200)).body).toEqual([]);
  await ajeno
    .subir('put', `/panel/reportes/${body.id}/captura`, 'captura', await png())
    .expect(404);
});
