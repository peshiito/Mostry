import type { Ejecutor } from '../../../shared/db/ejecutor.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import type { Medio } from '../../../shared/db/tipos/caja.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { registrarMovimiento } from '../../caja/servicios/registrarMovimiento.js';
import { sumarSello } from '../../club/sellos/sumarSello.js';
import { programarBorradoFotos } from '../../encargos/fotos/programarBorrado.js';
import type { Pedido } from '../repositorios/pedidos.repository.js';
import { restoACobrar } from './montos.js';

// Lo que pasa al entregar, dentro de la misma transacción que el cambio de
// estado: el resto de un encargo entra a la caja (6.2) y, si el pedido es de un
// cliente del Club, suma su sello (un pedido cancelado nunca llega acá).
export async function alEntregar(
  tx: Ejecutor,
  tiendaId: TiendaId,
  p: Pedido,
  medioCobro?: Medio,
) {
  await programarBorradoFotos(tx, tiendaId, p.id);
  const resto = restoACobrar(p);
  if (p.tipo === 'encargo' && resto > 0) {
    if (!medioCobro)
      throw new AppError(
        409,
        'falta_cobrar',
        'Indicá cómo cobraste el resto del encargo.',
        { resto },
      );
    await registrarMovimiento(tx, tiendaId, {
      tipo: 'ingreso',
      medio: medioCobro,
      monto: resto,
      concepto: `Resto del encargo #${p.numero}`,
      origen: 'pedido',
      origenId: p.id,
    });
  }
  if (p.clienteId)
    await sumarSello(tx, tiendaId, {
      clienteId: p.clienteId,
      origen: 'pedido',
      origenId: p.id,
      monto: p.subtotal - p.descuento, // lo que pagó por los productos
    });
}
