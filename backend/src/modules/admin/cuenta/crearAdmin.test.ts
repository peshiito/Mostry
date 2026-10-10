import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { limpiarBase } from '../../../test/limpiarBase.js';
import { crearAdmin } from './crearAdmin.js';

const CLAVE = 'una-clave-larga-de-verdad';

// El comando que crea el admin real en producción (npm run admin:crear).
describe('crear el admin de Mostry', () => {
  beforeEach(limpiarBase);

  it('crea la cuenta verificada, como admin, con la contraseña hasheada', async () => {
    await crearAdmin({
      email: ' Pedro@Mostry.com.ar ',
      nombre: 'Pedro Báez',
      clave: CLAVE,
    });
    const u = await db.selectFrom('usuarios').selectAll().executeTakeFirstOrThrow();
    expect(u).toMatchObject({
      email: 'pedro@mostry.com.ar',
      nombre: 'Pedro Báez',
    });
    expect(Boolean(u.esAdmin)).toBe(true);
    expect(u.emailVerificadoEn).toBeInstanceOf(Date);
    expect(u.hashClave).not.toContain(CLAVE);
  });

  it('rechaza contraseñas cortas y emails inválidos', async () => {
    await expect(
      crearAdmin({ email: 'a@b.com', nombre: 'Pedro', clave: 'corta' }),
    ).rejects.toThrow(/10 caracteres/);
    await expect(
      crearAdmin({ email: 'no-es-email', nombre: 'Pedro', clave: CLAVE }),
    ).rejects.toThrow();
  });

  it('no convierte en admin una cuenta que ya existe', async () => {
    await db
      .insertInto('usuarios')
      .values({ email: 'rosa@test.com', nombre: 'Rosa', hashClave: 'x' })
      .execute();
    await expect(
      crearAdmin({ email: 'rosa@test.com', nombre: 'Rosa', clave: CLAVE }),
    ).rejects.toThrow(/Ya existe/);
    const u = await db.selectFrom('usuarios').select('esAdmin').executeTakeFirstOrThrow();
    expect(Boolean(u.esAdmin)).toBe(false);
  });
});
