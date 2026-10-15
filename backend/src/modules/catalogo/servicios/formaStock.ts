import { db } from '../../../shared/db/db.js';
import type { ModoStock } from '../../../shared/db/tipos/catalogo.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { AppError } from '../../../shared/errors/AppError.js';
import type { CambiosProducto, DatosProducto } from '../schemas.js';

// La forma por defecto de la tienda (la que eligió en las preguntas del inicio).
async function formaDeLaTienda(tiendaId: TiendaId): Promise<ModoStock> {
  const t = await db
    .selectFrom('tiendas')
    .select('modoStock')
    .where('id', '=', tiendaId)
    .executeTakeFirstOrThrow();
  return t.modoStock;
}

// Producto nuevo: sin forma, usa la de la tienda. Solo "unidades" guarda stock;
// lo que se hace a pedido siempre se puede encargar.
export async function nuevoSegunForma(tiendaId: TiendaId, datos: DatosProducto) {
  const modoStock = datos.modoStock ?? (await formaDeLaTienda(tiendaId));
  const cuenta = modoStock === 'unidades';
  // conEncargo va primero: lo calculado acá (forma y stock) no se pisa.
  return {
    ...conEncargo(modoStock === 'a_pedido', datos),
    modoStock,
    stock: cuenta ? (datos.stock ?? 0) : 0,
    stockMinimo: cuenta ? (datos.stockMinimo ?? 0) : 0,
  };
}

// Lo que se personaliza solo se encarga (CHECK de 0048): pedirla prende el
// encargo, y apagar el encargo la apaga.
function conEncargo<T extends CambiosProducto>(aPedido: boolean, d: T): T {
  if (aPedido || d.pidePersonalizacion) return { ...d, aceptaEncargo: true };
  if (d.aceptaEncargo === false) return { ...d, pidePersonalizacion: false };
  return d;
}

// Edición: pasar a "a pedido" prende el encargo; apagar el encargo de algo que
// se hace a pedido no tiene sentido (no se podría vender de ninguna forma).
export function cambiosSegunForma(actual: ModoStock, cambios: CambiosProducto) {
  const forma = cambios.modoStock ?? actual;
  if (forma === 'a_pedido' && cambios.aceptaEncargo === false) {
    throw new AppError(
      409,
      'a_pedido_sin_encargo',
      'Lo que se hace a pedido tiene que poder encargarse.',
    );
  }
  if (cambios.pidePersonalizacion && cambios.aceptaEncargo === false) {
    throw new AppError(
      409,
      'personalizar_sin_encargo',
      'Lo que se personaliza tiene que poder encargarse.',
    );
  }
  return conEncargo(cambios.modoStock === 'a_pedido', cambios);
}
