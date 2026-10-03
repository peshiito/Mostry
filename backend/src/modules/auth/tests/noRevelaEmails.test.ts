import type { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { crearApp } from '../../../app.js';
import { limpiarBase } from '../../../test/limpiarBase.js';
import { crearMailerFalso } from '../../../test/mailerFalso.js';
import { ORIGEN_SITIO } from '../../../test/sesionHttp.js';

// Ninguna respuesta tiene que permitir averiguar si un email está registrado.
describe('no revela qué emails existen', () => {
  let app: Express;
  let correo: ReturnType<typeof crearMailerFalso>;
  const post = (ruta: string, body: object) =>
    request(app).post(ruta).set('Origin', ORIGEN_SITIO).send(body);

  beforeEach(async () => {
    await limpiarBase();
    correo = crearMailerFalso();
    app = crearApp({ pingDb: async () => {}, mailer: correo.mailer });
  });

  it('reenviar a un email inexistente responde igual y no manda nada', async () => {
    const antes = correo.enviados.length;
    const res = await post('/auth/verificar-email/reenviar', { email: 'nadie@test.com' });
    expect(res.status).toBe(202);
    expect(correo.enviados).toHaveLength(antes);
  });

  it('un email inexistente recibe la misma respuesta y no se manda nada', async () => {
    const antes = correo.enviados.length;
    const res = await post('/auth/recuperar', { email: 'nadie@test.com' });
    expect(res.status).toBe(202);
    expect(correo.enviados).toHaveLength(antes);
  });
});
