import { db } from '../../../shared/db/db.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { programaRepo } from '../programa/programa.repository.js';
import { saldoDe } from '../sellos/saldo.js';
import { comprasDe } from './compras.js';

// Clientes del Club que compraron en ESTA tienda: solo el nombre (nada de
// email ni WhatsApp) y lo que compraron acá.
const idsDeSocios = (tiendaId: TiendaId) =>
  db
    .selectFrom('pedidos')
    .select(['clienteId', 'creadoEn as fecha'])
    .where('tiendaId', '=', tiendaId)
    .where('clienteId', 'is not', null)
    .unionAll((eb) =>
      eb
        .selectFrom('ventas')
        .select(['clienteId', 'creadaEn as fecha'])
        .where('tiendaId', '=', tiendaId)
        .where('clienteId', 'is not', null),
    )
    .execute();

export async function sociosDe(tiendaId: TiendaId) {
  const ultimo = new Map<number, Date>();
  for (const f of await idsDeSocios(tiendaId))
    if (f.clienteId && (ultimo.get(f.clienteId) ?? 0) < f.fecha)
      ultimo.set(f.clienteId, f.fecha);
  if (!ultimo.size) return [];
  const [clientes, programa] = await Promise.all([
    db
      .selectFrom('clientes')
      .select(['id', 'nombre'])
      .where('id', 'in', [...ultimo.keys()])
      .execute(),
    programaRepo.buscar(tiendaId),
  ]);
  const socios = await Promise.all(
    clientes.map(async (c) => ({
      id: c.id,
      nombre: c.nombre,
      sellos: await saldoDe(tiendaId, c.id, programa?.venceMeses ?? null),
      ultimaCompra: ultimo.get(c.id)!,
    })),
  );
  return socios.sort((a, b) => b.ultimaCompra.getTime() - a.ultimaCompra.getTime());
}

// La ficha de un socio: 404 si nunca compró en esta tienda (nadie mira ajenos).
export async function fichaDeSocio(tiendaId: TiendaId, clienteId: number) {
  const socio = (await sociosDe(tiendaId)).find((s) => s.id === clienteId);
  if (!socio)
    throw new AppError(404, 'socio_no_encontrado', 'No encontramos a ese cliente.');
  const compras = await comprasDe(clienteId, tiendaId);
  return { ...socio, compras: compras.map(({ tiendaId: _t, ...c }) => c) };
}
