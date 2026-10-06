import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { logoAWebp } from './procesarLogo.js';

// Un logo azul de 200×100 en medio de un lienzo blanco enorme (mucho margen).
const logoConMargen = () =>
  sharp({ create: { width: 2000, height: 1200, channels: 3, background: '#ffffff' } })
    .composite([
      {
        input: {
          create: { width: 200, height: 100, channels: 3, background: '#004f9f' },
        },
        left: 900,
        top: 550,
      },
    ])
    .png()
    .toBuffer();

describe('logoAWebp', () => {
  it('recorta el margen y lo centra en un cuadrado del lado pedido', async () => {
    const salida = await logoAWebp(await logoConMargen(), 512);
    const meta = await sharp(salida).metadata();
    expect([meta.format, meta.width, meta.height]).toEqual(['webp', 512, 512]);
    // Lo que queda visible (sin el relleno transparente) ocupa todo el ancho.
    const { info } = await sharp(salida).trim().toBuffer({ resolveWithObject: true });
    expect(info.width).toBeGreaterThanOrEqual(500);
    expect(info.height).toBeGreaterThan(240);
    expect(info.height).toBeLessThan(270);
  });

  it('un logo chiquito queda del mismo tamaño que uno grande', async () => {
    const chico = await sharp({
      create: { width: 60, height: 60, channels: 4, background: '#b3361f' },
    })
      .png()
      .toBuffer();
    const meta = await sharp(await logoAWebp(chico, 512)).metadata();
    expect([meta.width, meta.height]).toEqual([512, 512]);
  });
});
