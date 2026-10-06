import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import type { Mailer } from '../../../shared/email/mailer.js';
import { appConCuenta } from '../../../test/appConCuenta.js';
import { actualizarSuscripciones } from '../suscripciones.js';

const enDias = (d: number) => new Date(Date.now() + d * 86_400_000);
const caido: Mailer = { enviar: async () => Promise.reject(new Error('SMTP caído')) };

describe('suscripciones: fallas y bordes', () => {
  let ctx: Awaited<ReturnType<typeof appConCuenta>>;
  const avisos = () =>
    ctx.correo.enviados.filter((e) => /Quedan 3 días|pagar|suspendida/.test(e.asunto));

  beforeEach(async () => {
    ctx = await appConCuenta();
  });

  it('si el email falla, el aviso NO queda marcado y sale en la próxima corrida', async () => {
    await db
      .updateTable('tiendas')
      .set({ pruebaHasta: enDias(2.5) })
      .execute();
    expect((await actualizarSuscripciones(caido)).avisos).toBe(0);
    expect(await db.selectFrom('avisosSuscripcion').select('id').execute()).toEqual([]);
    await actualizarSuscripciones(ctx.correo.mailer);
    expect(avisos()).toHaveLength(1);
  });

  it('con suspensión manual actualiza el estado pero no manda avisos de pago', async () => {
    await db
      .updateTable('tiendas')
      .set({ suspendidaManual: true, motivoSuspension: 'Revisión' })
      .execute();
    expect(await actualizarSuscripciones(ctx.correo.mailer)).toMatchObject({
      actualizadas: 1,
      avisos: 0,
    });
    expect(
      (await db.selectFrom('tiendas').select('estado').executeTakeFirstOrThrow()).estado,
    ).toBe('suspendida');
  });

  it('un vencimiento nuevo (pagó y volvió a vencer) habilita avisar de nuevo', async () => {
    await db
      .updateTable('tiendas')
      .set({ pruebaHasta: enDias(-1) })
      .execute();
    await actualizarSuscripciones(ctx.correo.mailer);
    await db
      .updateTable('tiendas')
      .set({ planHasta: enDias(-0.5) })
      .execute();
    await actualizarSuscripciones(ctx.correo.mailer);
    expect(avisos()).toHaveLength(2);
  });
});
