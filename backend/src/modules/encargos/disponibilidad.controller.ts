import type { RequestHandler } from 'express';
import { z } from 'zod';
import { cargarAgenda } from '../horarios/repositorios/agenda.repository.js';
import { tiendaParaPedido } from '../pedidos/repositorios/tiendaParaPedido.repository.js';
import { anticipacionDelEncargo } from './anticipacion.js';
import { encargosDelDia } from './cupo.js';
import { disponibilidadEncargo } from './disponibilidad.js';

// Público: horarios elegibles para un encargo en una fecha.
export const disponibilidad: RequestHandler = async (req, res) => {
  const { fecha, productos } = z
    .strictObject({
      fecha: z.iso.date(),
      // Encargos 3: ids de los productos del carrito ("3,7"), para su anticipación.
      productos: z
        .string()
        .regex(/^\d{1,10}(,\d{1,10}){0,49}$/)
        .optional(),
    })
    .parse(req.query);
  const [agenda, t] = await Promise.all([
    cargarAgenda(req.tienda!.id),
    tiendaParaPedido(req.tienda!.id),
  ]);
  const ids = productos ? productos.split(',').map(Number) : [];
  const horas = await anticipacionDelEncargo(
    req.tienda!.id,
    t.anticipacionEncargoHoras,
    ids,
  );
  const d = disponibilidadEncargo(agenda, fecha, horas);
  const lleno =
    d.disponible &&
    t.cupoEncargosDia !== null &&
    (await encargosDelDia(req.tienda!.id, fecha)) >= t.cupoEncargosDia;
  res.json(lleno ? { fecha, disponible: false, motivo: 'sin_cupo', tramos: [] } : d);
};
