import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { crearApp } from '../../../app.js';
import { crearAdminLogueado, ORIGEN_ADMIN } from '../../../test/adminCompleto.js';
import { appConCuenta } from '../../../test/appConCuenta.js';
import { limpiarBase } from '../../../test/limpiarBase.js';
import { crearMailerFalso } from '../../../test/mailerFalso.js';

const nuevaApp = () =>
  crearApp({ pingDb: async () => {}, mailer: crearMailerFalso().mailer });

describe('admin: plantillas de WhatsApp', () => {
  let admin: Awaited<ReturnType<typeof crearAdminLogueado>>;
  const textoDe = (
    body: { plantillas: { clave: string; texto: string }[] },
    clave: string,
  ) => body.plantillas.find((p) => p.clave === clave)?.texto;

  beforeEach(async () => {
    await limpiarBase();
    admin = await crearAdminLogueado(nuevaApp());
  });

  it('trae las 4 plantillas con su texto de base y los datos de pago de Mostry', async () => {
    const { body } = await admin.get('/admin/plantillas').expect(200);
    expect(body.plantillas.map((p: { clave: string }) => p.clave)).toEqual([
      'vence_prueba',
      'vence_plan',
      'encuesta',
      'personalizado',
    ]);
    expect(textoDe(body, 'encuesta')).toMatch(/Soy Pedro Báez, creador de Mostry/);
    expect(body.datos).toEqual({
      alias: expect.any(String),
      titular: expect.any(String),
      precio: expect.any(Number),
    });
  });

  it('edita una plantilla y la puede volver al texto de base', async () => {
    const texto = 'Hola {dueno}, ¿cómo va {tienda}?';
    const editada = await admin.put('/admin/plantillas/encuesta', { texto }).expect(200);
    expect(textoDe(editada.body, 'encuesta')).toBe(texto);
    const base = await admin.delete('/admin/plantillas/encuesta').expect(200);
    expect(textoDe(base.body, 'encuesta')).toMatch(/Soy Pedro Báez/);
  });

  it('valida la clave, el texto y no acepta campos de más', async () => {
    await admin.put('/admin/plantillas/otra', { texto: 'x' }).expect(400);
    await admin.put('/admin/plantillas/encuesta', { texto: '   ' }).expect(400);
    await admin
      .put('/admin/plantillas/encuesta', { texto: 'a'.repeat(1001) })
      .expect(400);
    await admin
      .put('/admin/plantillas/encuesta', { texto: 'ok', clave: 'x' })
      .expect(400);
  });

  it('un comerciante no puede ver ni editar las plantillas', async () => {
    const { app, cuenta } = await appConCuenta();
    const comoAdmin = (r: request.Test) =>
      r.set('Origin', ORIGEN_ADMIN).set('Cookie', cuenta.cookie);
    await comoAdmin(request(app).get('/admin/plantillas')).expect(401);
    await comoAdmin(request(app).put('/admin/plantillas/encuesta'))
      .send({ texto: 'hola' })
      .expect(401);
  });
});
