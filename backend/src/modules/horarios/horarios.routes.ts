import { Router } from 'express';
import { horariosController as h } from './controladores/horarios.controller.js';

// Horarios y feriados del panel. El acceso (sesión, tienda, suspensión) lo pone rutasPanel.
export function rutasHorarios(): Router {
  const r = Router();
  r.get('/horarios', h.ver);
  r.put('/horarios', h.guardar);
  r.get('/horarios/estado', h.estado);
  r.get('/feriados', h.feriados);
  r.post('/feriados', h.agregarFeriado);
  r.delete('/feriados/:id', h.quitarFeriado);
  return r;
}
