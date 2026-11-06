import { Router } from 'express';
import { tiendaDelPanel } from '../../../shared/http/contextoPanel.js';
import { esquemaId } from '../../admin/schemas.js';
import { exigirMediosPropios } from '../medios/mediosLectura.js';
import { esquemaPagina } from './esquemaPagina.js';
import { mediosDePagina } from './esquemaPortada.js';
import {
  guardarBorrador,
  leerPagina,
  publicar,
  volverALaDeSiempre,
} from './pagina.service.js';
import { listarVersiones, restaurarVersion } from './versiones.js';

// "Armá tu página", bajo /panel/tienda/pagina.
export function rutasPagina(): Router {
  const r = Router();
  r.get('/', async (req, res) => {
    res.json(await leerPagina(tiendaDelPanel(req)));
  });
  r.put('/borrador', async (req, res) => {
    const doc = esquemaPagina.parse(req.body);
    await exigirMediosPropios(tiendaDelPanel(req), mediosDePagina(doc.bloques));
    await guardarBorrador(tiendaDelPanel(req), doc);
    res.json({ borrador: doc });
  });
  r.post('/publicar', async (req, res) => {
    res.json(await publicar(tiendaDelPanel(req)));
  });
  r.delete('/', async (req, res) => {
    await volverALaDeSiempre(tiendaDelPanel(req));
    res.status(204).end();
  });
  r.get('/versiones', async (req, res) => {
    res.json(await listarVersiones(tiendaDelPanel(req)));
  });
  r.post('/versiones/:id/restaurar', async (req, res) => {
    const id = esquemaId.parse(req.params.id);
    res.json({ borrador: await restaurarVersion(tiendaDelPanel(req), id) });
  });
  return r;
}
