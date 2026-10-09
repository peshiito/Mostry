import { describe, expect, it } from 'vitest';
import { soporteListo } from '../../../test/soporteListo.js';

// Lo más importante del modo soporte: aun con el permiso del comercio, el admin
// NUNCA llega a ventas, caja, gastos, fiados, pedidos ni datos de cobro.
const PROHIBIDAS = [
  '/pedidos',
  '/pedidos/1',
  '/caja',
  '/caja/resumen',
  '/caja/historial',
  '/gastos',
  '/proveedores',
  '/libreta/clientes',
  '/libreta/notas',
  '/promociones',
  '/tienda/suscripcion',
  '/reportes',
  '/soporte',
];

describe('modo soporte: privacidad', () => {
  it('sin permiso del comercio: 403 en todo, incluso el catálogo', async () => {
    const { admin, base } = await soporteListo(false);
    await admin.get(`${base}/productos`).expect(403);
    await admin.patch(`${base}/tienda/config`, { nombre: 'Otra' }).expect(403);
  });

  it('con permiso: catálogo y horarios sí; lo del negocio no existe', async () => {
    const { admin, base } = await soporteListo();
    await admin.get(`${base}/productos`).expect(200);
    await admin.get(`${base}/horarios`).expect(200);
    for (const ruta of PROHIBIDAS) {
      const r = await admin.get(`${base}${ruta}`);
      expect([ruta, r.status]).toEqual([ruta, 404]);
    }
    await admin
      .put(`${base}/tienda/cobro`, { alias: 'robado.alias', clave: 'x' })
      .expect(404);
    await admin.put(`${base}/tienda/pausa`, { pausada: true }).expect(404);
  });

  it('los datos de la tienda vienen sin el alias de cobro', async () => {
    const { admin, base } = await soporteListo();
    const { body } = await admin.get(`${base}/tienda/config`).expect(200);
    expect(body.nombre).toBeTruthy();
    expect(body).not.toHaveProperty('alias');
    expect(body).not.toHaveProperty('titularAlias');
  });
});
