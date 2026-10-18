import express from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { limite } from './rateLimit.js';

// S3: detrás de Cloudflare + el proxy del hosting (TRUST_PROXY=2) el límite
// cuenta por la IP del cliente, y un X-Forwarded-For inventado no lo esquiva.
// Así llega: el cliente pone lo que quiera, Cloudflare suma la IP real y el
// proxy del hosting suma la de Cloudflare (el socket es el proxy del hosting).
const CF = '172.68.1.1';
const cadena = (cliente: string, inventado?: string) =>
  [inventado, cliente, CF].filter(Boolean).join(', ');

function app() {
  const a = express();
  a.set('trust proxy', 2);
  a.get('/', limite(1, 2), (req, res) => {
    res.json({ ip: req.ip });
  });
  return a;
}

describe('IP real con TRUST_PROXY=2', () => {
  it('req.ip es la del cliente, no la de Cloudflare ni la inventada', async () => {
    const r = await request(app())
      .get('/')
      .set('X-Forwarded-For', cadena('200.1.1.1', '9.9.9.9'));
    expect(r.body.ip).toBe('200.1.1.1');
  });

  it('cambiar el X-Forwarded-For inventado no esquiva el límite', async () => {
    const a = app();
    for (const inventado of ['1.1.1.1', '2.2.2.2'])
      await request(a)
        .get('/')
        .set('X-Forwarded-For', cadena('200.1.1.1', inventado))
        .expect(200);
    await request(a)
      .get('/')
      .set('X-Forwarded-For', cadena('200.1.1.1', '3.3.3.3'))
      .expect(429);
  });

  it('otro cliente real tiene su propio límite', async () => {
    const a = app();
    for (let i = 0; i < 3; i++)
      await request(a).get('/').set('X-Forwarded-For', cadena('200.1.1.1'));
    await request(a).get('/').set('X-Forwarded-For', cadena('200.2.2.2')).expect(200);
  });
});
