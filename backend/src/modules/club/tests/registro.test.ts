import { VERSION_LEGAL } from '../../../config/legal.js';
import { beforeEach, describe, expect, it } from 'vitest';
import { crearApp } from '../../../app.js';
import { db } from '../../../shared/db/db.js';
import { club, datosCliente } from '../../../test/clubListo.js';
import { limpiarBase } from '../../../test/limpiarBase.js';
import { crearMailerFalso } from '../../../test/mailerFalso.js';

describe('Club · registro', () => {
  let correo: ReturnType<typeof crearMailerFalso>;
  let api: ReturnType<typeof club>;

  beforeEach(async () => {
    await limpiarBase();
    correo = crearMailerFalso();
    api = club(crearApp({ pingDb: async () => {}, mailer: correo.mailer }));
  });

  it('crea la cuenta, verifica el email y queda adentro', async () => {
    await api.post('/registro', datosCliente()).expect(201);
    const cliente = await db.selectFrom('clientes').selectAll().executeTakeFirstOrThrow();
    expect(cliente).toMatchObject({ whatsapp: '5491155551234', emailVerificadoEn: null });
    expect(cliente.aceptoTerminosEn).toBeInstanceOf(Date);
    expect(cliente.terminosVersion).toBe(VERSION_LEGAL);
    expect(cliente.hashClave).toMatch(/^\$argon2id\$/);

    const codigo = correo.ultimoCodigo('ana@test.com');
    const res = await api.post('/verificar-email', {
      email: 'ana@test.com',
      codigo,
      clave: datosCliente().clave,
    });
    expect(res.status).toBe(200);
    expect(String(res.headers['set-cookie'])).toMatch(/^__Host-mostry_club=/);
  });

  it('no revela si el email ya existe: misma respuesta y aviso por mail', async () => {
    const primera = await api.post('/registro', datosCliente()).expect(201);
    const codigo = correo.ultimoCodigo('ana@test.com');
    const { clave } = datosCliente();
    await api
      .post('/verificar-email', { email: 'ana@test.com', codigo, clave })
      .expect(200);
    const segunda = await api.post('/registro', datosCliente({ nombre: 'Otra' }));
    expect(segunda.body).toEqual(primera.body);
    expect(correo.enviados.at(-1)?.asunto).toBe('Ya tenés una cuenta en el Club Mostry');
    expect(await db.selectFrom('clientes').select('id').execute()).toHaveLength(1);
  });

  it('sin aceptar los términos o con campos de más, no hay cuenta', async () => {
    await api.post('/registro', datosCliente({ aceptoTerminos: false })).expect(400);
    await api.post('/registro', datosCliente({ activo: false })).expect(400);
    await api.post('/registro', datosCliente({ whatsapp: '15' })).expect(400);
    expect(correo.enviados).toHaveLength(0);
  });

  it('un código equivocado no verifica', async () => {
    await api.post('/registro', datosCliente()).expect(201);
    const res = await api.post('/verificar-email', {
      email: 'ana@test.com',
      codigo: '000000',
      clave: datosCliente().clave,
    });
    expect(res.status).toBe(400);
    expect(res.headers['set-cookie']).toBeUndefined();
  });
});
