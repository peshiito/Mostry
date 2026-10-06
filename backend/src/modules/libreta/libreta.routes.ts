import { Router } from 'express';
import * as c from './clientes.controller.js';
import * as n from './notas.controller.js';

// Libreta del panel (fiados y notas). El acceso lo pone rutasPanel.
export function rutasLibreta(): Router {
  const r = Router();
  r.get('/libreta/clientes', c.clientes);
  r.post('/libreta/clientes', c.crearCliente);
  r.get('/libreta/clientes/:id', c.cliente);
  r.patch('/libreta/clientes/:id', c.editarCliente);
  r.post('/libreta/clientes/:id/movimientos', c.movimiento);
  r.get('/libreta/notas', n.notas);
  r.post('/libreta/notas', n.crearNota);
  r.patch('/libreta/notas/:id', n.editarNota);
  r.delete('/libreta/notas/:id', n.borrarNota);
  return r;
}
