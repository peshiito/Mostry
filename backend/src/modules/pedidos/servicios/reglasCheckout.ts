import { AppError } from '../../../shared/errors/AppError.js';
import type { Agenda } from '../../horarios/servicios/apertura.js';
import { estadoApertura } from '../../horarios/servicios/apertura.js';
import { problemaFechaEncargo } from '../../horarios/servicios/fechaEncargo.js';
import type { TiendaParaPedido } from '../repositorios/tiendaParaPedido.repository.js';
import type { DatosCheckout } from '../schemas.js';

const MENSAJES_ENCARGO = {
  pausada: 'La tienda está pausada y no toma encargos por ahora.',
  pasado: 'Elegí una fecha y hora futuras.',
  anticipacion: 'Ese horario no llega con la anticipación que necesita la tienda.',
  muy_lejos: 'Elegí una fecha dentro de los próximos 60 días.',
  feriado_o_fuera_de_horario: 'La tienda no atiende en ese día u horario.',
} as const;

// Reglas de la tienda que no dependen del stock (secciones 6.2 y 6.3).
export function validarReglasCheckout(
  t: TiendaParaPedido,
  agenda: Agenda,
  d: DatosCheckout,
  ahora: Date,
) {
  if (agenda.pausada)
    throw new AppError(
      409,
      'tienda_pausada',
      'La tienda está pausada: no toma pedidos por ahora.',
    );
  if (
    (d.entrega === 'envio' && !t.aceptaEnvio) ||
    (d.entrega === 'retiro' && !t.aceptaRetiro)
  ) {
    throw new AppError(
      400,
      'entrega_no_disponible',
      'La tienda no ofrece esa forma de entrega.',
    );
  }
  if (d.tipo === 'inmediato' && !estadoApertura(agenda, ahora).abierta) {
    throw new AppError(
      409,
      'tienda_cerrada_ahora',
      'Ahora está cerrado: podés hacer un encargo para otro día.',
    );
  }
  if (d.tipo === 'encargo') {
    const problema = problemaFechaEncargo(
      agenda,
      t.anticipacionEncargoHoras,
      d.fechaEncargo!,
      ahora,
    );
    if (problema)
      throw new AppError(400, 'fecha_encargo_invalida', MENSAJES_ENCARGO[problema], {
        problema,
      });
  }
}
