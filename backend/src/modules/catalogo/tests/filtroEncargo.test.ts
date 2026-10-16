import { beforeEach, describe, expect, it } from 'vitest';
import { cargar } from '../../../test/encargoManual.js';
import { tiendaLista } from '../../../test/tiendaLista.js';

// Encargos 3: "Cargar encargo" lista solo lo que se encarga, y la agenda
// distingue lo que cargó el comerciante.
describe('encargos cargados a mano: listas del panel', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;

  beforeEach(async () => {
    t = await tiendaLista();
  });

  it('el filtro encargo=true deja solo los productos que se encargan', async () => {
    const res = await t.panel.get('/panel/productos?encargo=true').expect(200);
    expect(res.body.productos.map((p: { nombre: string }) => p.nombre)).toEqual([
      'Rogel',
    ]);
  });

  it('la agenda dice si el encargo lo cargó el comerciante', async () => {
    await cargar(t).expect(201);
    const [e] = (await t.panel.get('/panel/encargos')).body;
    expect(e).toMatchObject({ origen: 'panel', tipo: 'encargo' });
  });
});
