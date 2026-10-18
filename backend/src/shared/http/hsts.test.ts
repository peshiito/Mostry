import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { crearApp } from '../../app.js';
import { crearMailerFalso } from '../../test/mailerFalso.js';
import { opcionesHsts } from './hsts.js';

// S3: HSTS solo con https y un dominio real.
describe('HSTS de la API', () => {
  it('en producción: 1 año, con subdominios y sin preload', () => {
    expect(
      opcionesHsts({ ORIGEN_PROTOCOLO: 'https', DOMINIO_BASE: 'mostry.com.ar' }),
    ).toEqual({
      maxAge: 31_536_000,
      includeSubDomains: true,
      preload: false,
    });
  });

  it('en local (http o *.localhost con Caddy) no se manda', async () => {
    expect(
      opcionesHsts({ ORIGEN_PROTOCOLO: 'http', DOMINIO_BASE: 'mostry.com.ar' }),
    ).toBe(false);
    expect(
      opcionesHsts({ ORIGEN_PROTOCOLO: 'https', DOMINIO_BASE: 'mostry.localhost' }),
    ).toBe(false);
    const app = crearApp({ pingDb: async () => {}, mailer: crearMailerFalso().mailer });
    const res = await request(app).get('/health');
    expect(res.headers['strict-transport-security']).toBeUndefined();
    // S3 (ZAP): nada de la API queda en cachés.
    expect(res.headers['cache-control']).toBe('no-store');
  });
});
