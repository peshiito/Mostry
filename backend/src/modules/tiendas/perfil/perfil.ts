import type { RequestHandler } from 'express';
import { z } from 'zod';
import { db } from '../../../shared/db/db.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { tiendaDelPanel } from '../../../shared/http/contextoPanel.js';

// Rubros de las preguntas del inicio (solo sugieren; "otro" para el resto).
export const RUBROS = [
  'panaderia',
  'pasteleria',
  'almacen',
  'ropa',
  'artesanias',
  'otro',
] as const;

// Las respuestas de "Armá tu Mostry" (Mejoras 3, parte A). Todo obligatorio:
// es la pantalla completa, no un cambio suelto.
export const esquemaPerfil = z.strictObject({
  vendeOnline: z.boolean(),
  usaEncargos: z.boolean(),
  usaLibreta: z.boolean(),
  usaGastos: z.boolean(),
  usaClub: z.boolean(),
  rubro: z.enum(RUBROS),
  modoStock: z.enum(['unidades', 'simple', 'a_pedido']),
});
export type Perfil = z.infer<typeof esquemaPerfil>;

// Guarda el perfil y marca la tienda como configurada. Apagar un módulo no
// borra nada: si lo vuelve a prender, sus datos siguen ahí.
export const guardarPerfil = (tiendaId: TiendaId, p: Perfil) =>
  db
    .updateTable('tiendas')
    .set({ ...p, configuradaEn: new Date() })
    .where('id', '=', tiendaId)
    .execute();

export const perfilController: RequestHandler = async (req, res) => {
  const p = esquemaPerfil.parse(req.body);
  await guardarPerfil(tiendaDelPanel(req), p);
  res.json({ ...p, configurada: true });
};
