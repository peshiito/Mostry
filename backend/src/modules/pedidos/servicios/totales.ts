import { AppError } from '../../../shared/errors/AppError.js';
import type { DatosCheckout } from '../schemas.js';
import { calcularSena } from './montos.js';

type Linea = { productoId: number; precioUnitario: number; subtotal: number };
type Config = { costoEnvio: number; senaPorcentaje: number };

// Totales recalculados por el servidor. Si no coinciden con lo que vio el
// comprador, se le devuelven los precios nuevos para que confirme (decisión 27).
export function calcularTotales(d: DatosCheckout, lineas: Linea[], t: Config) {
  const subtotal = lineas.reduce((suma, l) => suma + l.subtotal, 0);
  const costoEnvio = d.entrega === 'envio' ? t.costoEnvio : 0;
  const total = subtotal + costoEnvio;
  if (total !== d.totalEsperado) {
    const precios = lineas.map(({ productoId, precioUnitario }) => ({
      productoId,
      precioUnitario,
    }));
    throw new AppError(409, 'precio_cambio', 'Cambiaron los precios. Revisá tu pedido.', {
      total,
      costoEnvio,
      precios,
    });
  }
  const sena =
    d.tipo === 'encargo' ? calcularSena({ total, porcentaje: t.senaPorcentaje }) : 0;
  // Inmediato: siempre se paga antes. Encargo: solo si la tienda pide seña.
  const requierePago = d.tipo === 'inmediato' || sena > 0;
  return { subtotal, costoEnvio, total, sena, requierePago };
}
