import { beforeEach, describe, expect, it } from 'vitest';
import { appConCuenta } from '../../../test/appConCuenta.js';
import { publico } from '../../../test/publico.js';

const perfil = {
  vendeOnline: false,
  usaEncargos: true,
  usaLibreta: false,
  usaGastos: true,
  usaClub: false,
  rubro: 'panaderia',
  modoStock: 'simple',
};

// Mejoras 3, parte A: las respuestas de "Armá tu Mostry" acomodan la tienda.
describe('perfil del negocio', () => {
  let ctx: Awaited<ReturnType<typeof appConCuenta>>;

  beforeEach(async () => {
    ctx = await appConCuenta('dona-rosa');
  });

  it('una tienda nueva arranca sin configurar; al guardar queda configurada', async () => {
    expect((await ctx.panel.get('/panel/tienda/config')).body.configuradaEn).toBeNull();
    await ctx.panel.put('/panel/tienda/perfil', perfil).expect(200);
    const { body } = await ctx.panel.get('/panel/tienda/config');
    expect(body).toMatchObject({
      vendeOnline: false,
      usaLibreta: false,
      rubro: 'panaderia',
    });
    expect(body.configuradaEn).not.toBeNull();
    await ctx.panel.put('/panel/tienda/perfil', { ...perfil, extra: 1 }).expect(400);
  });

  it('un módulo apagado se cierra en la API, y se abre al prenderlo', async () => {
    await ctx.panel.put('/panel/tienda/perfil', perfil).expect(200);
    const r = await ctx.panel.get('/panel/libreta/clientes');
    expect(r.status).toBe(403);
    expect(r.body.error.codigo).toBe('modulo_apagado');
    await ctx.panel.get('/panel/gastos').expect(200);
    await ctx.panel
      .put('/panel/tienda/perfil', { ...perfil, usaLibreta: true })
      .expect(200);
    await ctx.panel.get('/panel/libreta/clientes').expect(200);
  });

  it('sin venta online, la tienda pública no muestra catálogo ni toma pedidos', async () => {
    await ctx.panel.put('/panel/tienda/perfil', perfil).expect(200);
    const comprador = publico(ctx.app, 'dona-rosa');
    const r = await comprador.get('/publico/productos');
    expect(r.body.error.codigo).toBe('sin_venta_online');
    expect((await comprador.get('/publico/tienda')).body.vendeOnline).toBe(false);
  });

  it('con los encargos apagados, la tienda pública no los ofrece', async () => {
    await ctx.panel
      .put('/panel/tienda/perfil', { ...perfil, vendeOnline: true, usaEncargos: false })
      .expect(200);
    const r = await publico(ctx.app, 'dona-rosa').get('/publico/encargos/disponibilidad');
    expect(r.body.error.codigo).toBe('sin_encargos');
  });
});
