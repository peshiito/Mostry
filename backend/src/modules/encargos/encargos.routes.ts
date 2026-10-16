import { tiendaDelPanel } from '../../shared/http/contextoPanel.js';
import { Router, type RequestHandler } from 'express';
import { z } from 'zod';
import { enArgentina, inicioDiaAr } from '../../shared/utils/horaArgentina.js';
import { encargosEntre } from './encargos.repository.js';
import { disponibilidad } from './disponibilidad.controller.js';
import { crearEncargoManual } from './manual/crearEncargoManual.js';
import { esquemaEncargoManual } from './manual/esquema.js';

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
      tiendaDelPanel(req),
      inicioDiaAr(desde),
      new Date(inicioDiaAr(hasta).getTime() + DIA_MS),
    ),
  );
};

// Encargos 3: un encargo que llegó por WhatsApp, cargado por el comerciante.
const cargarEncargo: RequestHandler = async (req, res) => {
  const d = esquemaEncargoManual.parse(req.body);
  res.status(201).json(await crearEncargoManual(tiendaDelPanel(req), d));
};

export function rutasEncargosPanel(): Router {
  return Router().get('/encargos', calendario).post('/encargos', cargarEncargo);
}

export function rutasEncargosPublico(): Router {
  return Router().get('/encargos/disponibilidad', disponibilidad);
}
