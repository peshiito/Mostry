import { describe, expect, it } from 'vitest';
import { esquemaPagina } from '../pagina/esquemaPagina.js';

// Las plantillas de "Armá tu página" viven en el frontend: este test las arma y
// las pasa por el esquema del backend. Si alguien cambia uno sin el otro, falla
// acá y no cuando un comercio elige una plantilla.
const carpeta = new URL(
  '../../../../../frontend/src/features/pagina/plantillas/',
  import.meta.url,
);
type Plantilla = { clave: string };
type Modulo = Record<string, unknown>;
const cargar = (archivo: string): Promise<Modulo> =>
  import(new URL(archivo, carpeta).href) as Promise<Modulo>;

const catalogo = {
  productos: [{ id: 7 }, { id: 9 }],
  destacados: [{ id: 9 }],
  categorias: [{ id: 3, cantidad: 4 }],
};

describe('plantillas de la página', () => {
  it('todas pasan el esquema, con productos y sin productos', async () => {
    const { PLANTILLAS } = (await cargar('index.js')) as { PLANTILLAS: Plantilla[] };
    const { armarPlantilla } = (await cargar('armar.js')) as {
      armarPlantilla: (clave: string, opciones?: object) => unknown;
    };
    expect(PLANTILLAS.length).toBe(12);
    for (const { clave } of PLANTILLAS) {
      for (const opciones of [{ catalogo }, {}]) {
        const r = esquemaPagina.safeParse(armarPlantilla(clave, opciones));
        expect(r.success, `${clave}: ${r.error?.message ?? ''}`).toBe(true);
      }
    }
  });
});
