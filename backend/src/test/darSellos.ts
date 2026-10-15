import { db } from '../shared/db/db.js';
import { tiendasRepo } from '../modules/tiendas/tiendas.repository.js';

// Le da `n` sellos a Ana en Doña Rosa (atajo: sin pasar por n compras).
export async function darSellos(n: number, creadoEn = new Date()) {
  const tienda = await tiendasRepo.buscarPorSlug('dona-rosa');
  const ana = await db.selectFrom('clientes').select('id').executeTakeFirstOrThrow();
  const base = Math.floor(Math.random() * 1e6) + 1e6;
  await db
    .insertInto('sellos')
    .values(
      Array.from({ length: n }, (_, i) => ({
        tiendaId: tienda!.id,
        clienteId: ana.id,
        origen: 'venta' as const,
        origenId: base + i,
        monto: 100_000,
        creadoEn,
      })),
    )
    .execute();
}
