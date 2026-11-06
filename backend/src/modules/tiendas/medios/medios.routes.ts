import { Router } from 'express';
import { recibirArchivo } from '../../../shared/archivos/recibirArchivo.js';
import { tiendaDelPanel } from '../../../shared/http/contextoPanel.js';
import { limite } from '../../../shared/http/rateLimit.js';
import { esquemaId } from '../../admin/schemas.js';
import { listarMedios } from './mediosLectura.js';
import { borrarMedio } from './borrarMedio.js';
import { agregarMedio } from './medios.service.js';

// Biblioteca de imágenes ("Armá tu página", P3), bajo /panel/tienda/medios.
export function rutasMedios(): Router {
  const r = Router();
  r.get('/', async (req, res) => {
    res.json(await listarMedios(tiendaDelPanel(req)));
  });
  r.post('/', limite(10, 40), recibirArchivo('archivo', 8), async (req, res) => {
    res.status(201).json(await agregarMedio(tiendaDelPanel(req), req.file!.buffer));
  });
  r.delete('/:id', async (req, res) => {
    await borrarMedio(tiendaDelPanel(req), esquemaId.parse(req.params.id));
    res.status(204).end();
  });
  return r;
}
