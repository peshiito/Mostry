import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { appConCuenta } from '../../../test/appConCuenta.js';
import { avisoQueCorresponde } from '../avisosSuscripcion.js';
import { actualizarSuscripciones } from '../suscripciones.js';

const enDias = (d: number) => new Date(Date.now() + d * 86_400_000);

describe('worker: suscripciones y avisos', () => {
  let ctx: Awaited<ReturnType<typeof appConCuenta>>;
  const avisosA = () =>
    ctx.correo.enviados.filter(
      (e) => e.para === ctx.cuenta.email && /prueba|pagar|suspendida/i.test(e.asunto),
    );

  beforeEach(async () => {
    ctx = await appConCuenta();
  });

  it('a 3 días del fin de la prueba avisa UNA sola vez, aunque el job corra dos veces', async () => {
    await db
      .updateTable('tiendas')
      .set({ pruebaHasta: enDias(2.5) })
      .execute();
    await actualizarSuscripciones(ctx.correo.mailer);
    await actualizarSuscripciones(ctx.correo.mailer);
    expect(avisosA()).toHaveLength(1);
    expect(avisosA()[0]!.asunto).toContain('Quedan 3 días');
    expect(avisosA()[0]!.texto).toContain('mostry.pagos');
  });

  it('actualiza el estado guardado (caché del admin) y avisa al entrar en gracia', async () => {
    await db
      .updateTable('tiendas')
      .set({ pruebaHasta: enDias(-1) })
      .execute();
    expect(await actualizarSuscripciones(ctx.correo.mailer)).toMatchObject({
      actualizadas: 1,
      avisos: 1,
    });
    expect(
      (await db.selectFrom('tiendas').select('estado').executeTakeFirstOrThrow()).estado,
    ).toBe('gracia');
  });

  it('elige el aviso por horas restantes (no se pierde si un día no corrió)', () => {
    expect(avisoQueCorresponde('prueba', 70)).toBe('prueba_3_dias');
    expect(avisoQueCorresponde('prueba', 50)).toBe('prueba_3_dias');
    expect(avisoQueCorresponde('prueba', 20)).toBe('prueba_1_dia');
    expect(avisoQueCorresponde('prueba', 100)).toBeNull();
    expect(avisoQueCorresponde('activa', 20)).toBeNull();
    expect(avisoQueCorresponde('suspendida', 0)).toBe('suspendida');
  });
});
