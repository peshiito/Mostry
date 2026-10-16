import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  transportePush,
  type ContenidoPush,
} from '../../../modules/avisos/transporte.js';
import { db } from '../../../shared/db/db.js';
import { enArgentina } from '../../../shared/utils/horaArgentina.js';
import { resumenListo } from '../../../test/resumenListo.js';
import { resumenManana } from '../resumenManana.js';

// Hoy a esa hora de Argentina.
const aLas = (hora: string) =>
  new Date(`${enArgentina(new Date()).fecha}T${hora}:00-03:00`);

// Avisos 1: a la hora de abrir, si quedó algo esperando, push y mail.
describe('resumen de la mañana', () => {
  let t: Awaited<ReturnType<typeof resumenListo>>;
  let enviar: ReturnType<typeof vi.spyOn>;
  const mails = () =>
    t.correo.enviados.filter((m) => /esperando en Mostry/.test(m.asunto));

  beforeEach(async () => {
    t = await resumenListo();
    enviar = vi.spyOn(transportePush, 'enviar').mockResolvedValue('ok');
  });

  it('una tienda 24 h lo recibe a las 9 (no a la medianoche), una sola vez', async () => {
    await resumenManana(t.correo.mailer, aLas('01:00'));
    expect(mails()).toEqual([]);
    await resumenManana(t.correo.mailer, aLas('09:00'));
    await resumenManana(t.correo.mailer, aLas('09:15'));
    const resumen = (enviar.mock.calls as [unknown, ContenidoPush][])
      .map(([, c]) => c)
      .filter((c) => c.tag === 'resumen');
    expect(resumen).toEqual([
      expect.objectContaining({
        cuerpo: '1 comprobante para revisar · 1 encargo por aceptar',
        url: '/panel/pedidos',
      }),
    ]);
    expect(mails()).toHaveLength(1);
    expect(mails()[0]!.texto).toMatch(/1 comprobante para revisar/);
  });

  it('antes de abrir o pasadas 3 h no manda; pausada tampoco', async () => {
    await db.updateTable('horarios').set({ abre: '08:00' }).execute();
    await resumenManana(t.correo.mailer, aLas('07:00'));
    await resumenManana(t.correo.mailer, aLas('11:30'));
    await db.updateTable('tiendas').set({ pausada: true }).execute();
    await resumenManana(t.correo.mailer, aLas('08:30'));
    expect(mails()).toEqual([]);
  });

  it('sin horario ese día, a las 9; sin nada esperando, nada', async () => {
    await db.deleteFrom('horarios').execute();
    await resumenManana(t.correo.mailer, aLas('08:00'));
    expect(mails()).toEqual([]);
    await resumenManana(t.correo.mailer, aLas('09:10'));
    expect(mails()).toHaveLength(1);
    await db
      .updateTable('pedidos')
      .set({ estado: 'cancelado', canceladoEn: new Date() })
      .execute();
    await db.deleteFrom('avisosPush').execute();
    await resumenManana(t.correo.mailer, aLas('09:20'));
    expect(mails()).toHaveLength(1);
  });
});
