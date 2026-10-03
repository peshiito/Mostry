import express from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { ORIGEN_ADMIN, ORIGEN_TIENDA } from '../../test/origenes.js';
import { manejarErrores } from './manejarErrores.js';
import { resolverTienda, type BuscarTiendaPorSlug } from './resolverTienda.js';

const buscar: BuscarTiendaPorSlug = async (slug) =>
  slug === 'heladeria' ? { id: 7, slug } : undefined;

const app = express();
app.get('/tienda', resolverTienda(buscar), (req, res) => {
  res.json(req.tienda);
});
app.use(manejarErrores);

describe('resolverTienda', () => {
  it('deja la tienda del Origin en req.tienda', async () => {
    const res = await request(app).get('/tienda').set('Origin', ORIGEN_TIENDA);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 7, slug: 'heladeria' });
  });

  it('da 404 si el subdominio no es una tienda existente', async () => {
    const res = await request(app)
      .get('/tienda')
      .set('Origin', 'http://cerrajeria.localhost:5173');
    expect(res.status).toBe(404);
    expect(res.body.error.codigo).toBe('tienda_no_encontrada');
  });

  it('da 400 si el origen no es de una tienda', async () => {
    for (const origen of [ORIGEN_ADMIN, undefined]) {
      const req = request(app).get('/tienda');
      const res = await (origen ? req.set('Origin', origen) : req);
      expect(res.status).toBe(400);
      expect(res.body.error.codigo).toBe('tienda_requerida');
    }
  });
});
