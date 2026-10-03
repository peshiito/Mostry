import { crearMailerFalso } from '../../test/mailerFalso.js';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { crearApp } from '../../app.js';
import { ORIGEN_AJENO, ORIGEN_TIENDA } from '../../test/origenes.js';

const app = crearApp({ pingDb: async () => {}, mailer: crearMailerFalso().mailer });

describe('CORS', () => {
  it('habilita credenciales para orígenes de Mostry', async () => {
    const res = await request(app).get('/health').set('Origin', ORIGEN_TIENDA);
    expect(res.headers['access-control-allow-origin']).toBe(ORIGEN_TIENDA);
    expect(res.headers['access-control-allow-credentials']).toBe('true');
  });

  it('no habilita orígenes ajenos', async () => {
    const res = await request(app).get('/health').set('Origin', ORIGEN_AJENO);
    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });
});

describe('verificarOrigen (CSRF)', () => {
  it('rechaza escrituras sin Origin o con Origin ajeno', async () => {
    const sinOrigen = await request(app).post('/lo-que-sea');
    const ajeno = await request(app).post('/lo-que-sea').set('Origin', ORIGEN_AJENO);
    for (const res of [sinOrigen, ajeno]) {
      expect(res.status).toBe(403);
      expect(res.body.error.codigo).toBe('origen_no_permitido');
    }
  });

  it('deja pasar escrituras desde un origen de Mostry', async () => {
    const res = await request(app).post('/lo-que-sea').set('Origin', ORIGEN_TIENDA);
    expect(res.status).toBe(404);
  });
});

describe('headers de seguridad', () => {
  it('no se deja embeber y no revela Express', async () => {
    const res = await request(app).get('/health');
    expect(res.headers['content-security-policy']).toContain("frame-ancestors 'none'");
    expect(res.headers['x-powered-by']).toBeUndefined();
  });
});
