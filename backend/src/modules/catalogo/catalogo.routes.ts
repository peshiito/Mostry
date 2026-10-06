import { Router } from 'express';
import { recibirArchivo } from '../../shared/archivos/recibirArchivo.js';
import { limite } from '../../shared/http/rateLimit.js';
import { categoriasController as cat } from './controladores/categorias.controller.js';
import { fotosController as fotos } from './controladores/fotos.controller.js';
import { productosController as prod } from './controladores/productos.controller.js';

// Catálogo del panel. El acceso (sesión, tienda, suspensión) lo pone rutasPanel.
export function rutasCatalogo(): Router {
  const r = Router();

  r.get('/categorias', cat.listar);
  r.post('/categorias', cat.crear);
  r.put('/categorias/orden', cat.reordenar);
  r.patch('/categorias/:id', cat.renombrar);
  r.delete('/categorias/:id', cat.borrar);

  r.get('/productos', prod.listar);
  r.post('/productos', prod.crear);
  r.get('/productos/:id', prod.ver);
  r.patch('/productos/:id', prod.editar);

  // Subidas: rate limit y el archivo se lee recién después de validar sesión y tienda.
  r.get('/productos/:id/fotos', fotos.listar);
  r.post('/productos/:id/fotos', limite(10, 30), recibirArchivo('foto'), fotos.agregar);
  r.put('/productos/:id/fotos/orden', fotos.ordenar);
  r.delete('/productos/:id/fotos/:fotoId', fotos.borrar);
  return r;
}
