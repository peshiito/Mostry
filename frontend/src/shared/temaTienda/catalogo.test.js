// @vitest-environment node
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { CARGAS } from './cargas.js';
import { CLAVES_FUENTES, FUENTES_TEXTO } from './fuentes.js';
import { TEMAS } from './temas.js';

// El backend valida el tema con su propia lista (catalogoTema.ts): tiene que ser
// la misma que la del frontend, o el comercio podría elegir algo que no se guarda.
const catalogo = readFileSync(
  new URL(
    '../../../../backend/src/modules/tiendas/tema/catalogoTema.ts',
    import.meta.url,
  ),
  'utf8',
);
const lista = (nombre) =>
  [
    ...catalogo
      .match(new RegExp(`${nombre} = \\[([^\\]]*)\\]`))[1]
      .matchAll(/'([^']+)'/g),
  ].map((m) => m[1]);

describe('catálogo del tema', () => {
  it('las fuentes del frontend y del backend son las mismas', () => {
    expect(lista('FUENTES')).toEqual(CLAVES_FUENTES);
    expect(lista('FUENTES_TEXTO')).toEqual(FUENTES_TEXTO.map((f) => f.clave));
  });

  it('cada fuente (salvo las que ya vienen) tiene cómo descargarse', () => {
    const faltan = CLAVES_FUENTES.filter(
      (c) => !['rubik', 'work-sans'].includes(c) && !CARGAS[c],
    );
    expect(faltan).toEqual([]);
  });

  it('los temas armados usan opciones que el backend acepta', () => {
    const patrones = lista('PATRONES');
    const texto = lista('FUENTES_TEXTO');
    for (const { tema } of TEMAS) {
      expect(patrones).toContain(tema.fondo.patron);
      expect(texto).toContain(tema.fuentes.texto);
      expect(CLAVES_FUENTES).toContain(tema.fuentes.titulos);
    }
  });
});
