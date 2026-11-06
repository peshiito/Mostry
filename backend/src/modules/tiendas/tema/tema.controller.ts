import type { RequestHandler } from 'express';
import { db } from '../../../shared/db/db.js';
import { tiendaDelPanel } from '../../../shared/http/contextoPanel.js';
import { esquemaTema } from './esquemaTema.js';

// PUT /panel/tienda/tema: guarda el diseño de la vidriera (V1). Se guarda entero
// (el editor manda siempre el tema completo).
export const guardarTema: RequestHandler = async (req, res) => {
  const tema = esquemaTema.parse(req.body);
  await db
    .updateTable('tiendas')
    .set({ tema: JSON.stringify(tema) })
    .where('id', '=', tiendaDelPanel(req))
    .execute();
  res.json({ tema });
};
