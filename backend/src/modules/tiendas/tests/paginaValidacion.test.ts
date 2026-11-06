import { beforeEach, describe, it } from 'vitest';
import { tiendaLista } from '../../../test/tiendaLista.js';
import { paginaDePrueba } from './paginaDePrueba.js';

type Pagina = ReturnType<typeof paginaDePrueba>;
const con = (cambio: (p: Pagina & Record<string, unknown>) => void) => {
  const p = paginaDePrueba() as Pagina & Record<string, unknown>;
  cambio(p);
  return p;
};
const hero = (p: Pagina) => p.bloques[0] as unknown as { datos: Record<string, unknown> };
const boton = (destino: object) => (p: Pagina) => {
  hero(p).datos.botones = [{ texto: 'Ir', destino }];
};

// El documento de la página entra solo si es exactamente lo que esperamos.
describe('página de la tienda: validación', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;
  beforeEach(async () => {
    t = await tiendaLista();
  });

  it('rechaza links peligrosos, tipos inventados, campos de más y páginas enormes', async () => {
    const malas = [
      con(boton({ tipo: 'web', url: 'javascript:alert(1)' })),
      con(boton({ tipo: 'web', url: 'http://sitio.com' })),
      con(boton({ tipo: 'web', url: 'data:text/html,hola' })),
      con(boton({ tipo: 'inventado' })),
      con(boton({ tipo: 'producto', id: -1 })),
      con((p) => {
        (p.bloques as unknown[]).push({
          id: 'x12345',
          tipo: 'html',
          visible: true,
          datos: {},
        });
      }),
      con((p) => {
        hero(p).datos.html = '<script>alert(1)</script>';
      }),
      con((p) => {
        p.extra = true;
      }),
      con((p) => {
        p.bloques[1]!.id = 'hero01';
      }),
      con((p) => {
        p.bloques[0]!.id = 'Con Espacios';
      }),
      con((p) => {
        const b = p.bloques[3] as unknown as { datos: { cuerpo: string } };
        b.datos.cuerpo = 'x'.repeat(1501);
      }),
      con((p) => {
        p.bloques = Array.from({ length: 41 }, (_, i) => ({
          id: `bloque${i}`,
          tipo: 'beneficios',
          visible: true,
          datos: {},
        })) as Pagina['bloques'];
      }),
      con((p) => {
        p.ajustes.tarjeta.botones = ['agregar', 'agregar'] as never;
      }),
    ];
    for (const m of malas)
      await t.panel.put('/panel/tienda/pagina/borrador', m).expect(400);
  });
});
