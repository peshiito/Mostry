import { Router, type RequestHandler } from 'express';
import { recibirArchivo } from '../../../shared/archivos/recibirArchivo.js';
import { db } from '../../../shared/db/db.js';
import { tiendaDelPanel } from '../../../shared/http/contextoPanel.js';
import { limite } from '../../../shared/http/rateLimit.js';
import { esquemaId } from '../../admin/schemas.js';
import { esquemaContenido } from './esquemaContenido.js';
import { agregarFoto } from './galeria.js';
import { borrarFoto, fotosGaleria } from './galeriaLectura.js';
import { quitarPortada, subirPortada } from './portada.js';

const contenido: RequestHandler = async (req, res) => {
  const datos = esquemaContenido.parse(req.body);
  await db
    .updateTable('tiendas')
    .set({ contenido: JSON.stringify(datos) })
    .where('id', '=', tiendaDelPanel(req))
    .execute();
  res.json({ contenido: datos });
};

// Vidriera 2.0 (V3 y V4), bajo /panel/tienda/vidriera.
export function rutasVidriera(): Router {
  const r = Router();
  r.put('/contenido', contenido);
  r.put('/portada', limite(10, 20), recibirArchivo('portada'), async (req, res) => {
    res.json(await subirPortada(tiendaDelPanel(req), req.file!.buffer));
  });
  r.delete('/portada', async (req, res) => {
    await quitarPortada(tiendaDelPanel(req));
    res.status(204).end();
  });
  r.get('/galeria', async (req, res) => {
    res.json(await fotosGaleria(tiendaDelPanel(req)));
  });
  r.post('/galeria', limite(10, 30), recibirArchivo('foto'), async (req, res) => {
    res.status(201).json(await agregarFoto(tiendaDelPanel(req), req.file!.buffer));
  });
  r.delete('/galeria/:id', async (req, res) => {
    await borrarFoto(tiendaDelPanel(req), esquemaId.parse(req.params.id));
    res.status(204).end();
  });
  return r;
}
