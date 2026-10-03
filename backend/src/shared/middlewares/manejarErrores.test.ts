import express from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { AppError } from '../errors/AppError.js';
import { manejarErrores } from './manejarErrores.js';

const app = express();
app.use(express.json({ limit: '1kb' }));
app.get('/app-error', () => {
  throw new AppError(409, 'conflicto', 'Ya existe.');
});
app.get('/zod', () => {
  z.object({ nombre: z.string() }).parse({});
});
app.get('/explota', () => {
  throw new Error('detalle interno secreto');
});
app.post('/json', (_req, res) => {
  res.json({ ok: true });
});
app.use(manejarErrores);

describe('manejarErrores', () => {
  it('respeta el status y el mensaje de AppError', async () => {
    const res = await request(app).get('/app-error');
    expect(res.status).toBe(409);
    expect(res.body.error).toEqual({ codigo: 'conflicto', mensaje: 'Ya existe.' });
  });

  it('convierte errores de Zod en 400 con los campos', async () => {
    const res = await request(app).get('/zod');
    expect(res.status).toBe(400);
    expect(res.body.error.codigo).toBe('datos_invalidos');
    expect(res.body.error.campos[0].campo).toBe('nombre');
  });

  it('no filtra detalles internos en un 500', async () => {
    const res = await request(app).get('/explota');
    expect(res.status).toBe(500);
    expect(JSON.stringify(res.body)).not.toContain('secreto');
  });

  it('maneja JSON roto y payloads gigantes', async () => {
    const roto = await request(app).post('/json').type('json').send('{malo');
    expect(roto.status).toBe(400);
    const gigante = await request(app)
      .post('/json')
      .send({ x: 'a'.repeat(5000) });
    expect(gigante.status).toBe(413);
    expect(gigante.body.error.codigo).toBe('demasiado_grande');
  });
});
