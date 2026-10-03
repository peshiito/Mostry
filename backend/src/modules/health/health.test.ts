import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { crearApp } from '../../app.js';
import { pingDb } from '../../shared/db/db.js';

describe('GET /health', () => {
  it('responde 200 cuando la base responde', async () => {
    const res = await request(crearApp({ pingDb: async () => {} })).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ estado: 'ok', db: 'ok' });
  });

  it('responde 503 cuando la base está caída', async () => {
    const caida = async () => {
      throw new Error('ECONNREFUSED');
    };
    const res = await request(crearApp({ pingDb: caida })).get('/health');
    expect(res.status).toBe(503);
    expect(res.body).toEqual({ estado: 'degradado', db: 'caida' });
  });

  it('se conecta a la base de tests real (requiere docker compose up)', async () => {
    const res = await request(crearApp({ pingDb })).get('/health');
    expect(res.status).toBe(200);
  });
});
