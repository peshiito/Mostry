import { Router, type RequestHandler } from 'express';
import { z } from 'zod';
import { enArgentina, inicioDiaAr } from '../../shared/utils/horaArgentina.js';
import { cargarAgenda } from '../horarios/repositorios/agenda.repository.js';
import { tiendaParaPedido } from '../pedidos/repositorios/tiendaParaPedido.repository.js';
import { disponibilidadEncargo } from './disponibilidad.js';
import { encargosEntre } from './encargos.repository.js';

const DIA_MS = 24 * 60 * 60 * 1000;
const enDias = (d: number) => enArgentina(new Date(Date.now() + d * DIA_MS)).fecha;
const periodo = z
  .strictObject({
    desde: z.iso.date().default(() => enDias(0)),
    hasta: z.iso.date().default(() => enDias(30)),
  })
  .refine(
    (p) =>
      p.desde <= p.hasta && (Date.parse(p.hasta) - Date.parse(p.desde)) / DIA_MS <= 92,
    'Período inválido (máximo 3 meses)',
  );

// Calendario del panel: encargos por fecha de entrega.
const calendario: RequestHandler = async (req, res) => {
  const { desde, hasta } = periodo.parse(req.query);
  res.json(
    await encargosEntre(
      req.tienda!.id,
      inicioDiaAr(desde),
      new Date(inicioDiaAr(hasta).getTime() + DIA_MS),
    ),
  );
};

// Público: horarios elegibles para un encargo en una fecha.
const disponibilidad: RequestHandler = async (req, res) => {
  const { fecha } = z.strictObject({ fecha: z.iso.date() }).parse(req.query);
  const [agenda, t] = await Promise.all([
    cargarAgenda(req.tienda!.id),
    tiendaParaPedido(req.tienda!.id),
  ]);
  res.json(disponibilidadEncargo(agenda, fecha, t.anticipacionEncargoHoras));
};

export function rutasEncargosPanel(): Router {
  return Router().get('/encargos', calendario);
}

export function rutasEncargosPublico(): Router {
  return Router().get('/encargos/disponibilidad', disponibilidad);
}
