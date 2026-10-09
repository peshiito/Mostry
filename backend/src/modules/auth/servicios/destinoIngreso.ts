import type { TipoSesion } from '../../../shared/db/tipos/usuarios.js';
import type { Zona } from '../../../shared/utils/zonaDesdeOrigen.js';
import { miembrosRepo } from '../../tiendas/miembros.repository.js';

export type Destino =
  | { zona: 'admin' }
  | { zona: 'tiendas'; tiendas: { slug: string; nombre: string }[] }
  | null;

// A dónde lleva el frontend después de entrar desde la landing (en la tienda o
// en el admin ya está en el lugar correcto: null).
export async function destinoIngreso(
  zona: Zona | null,
  sesion: { usuarioId: number; tipo: TipoSesion },
): Promise<Destino> {
  if (zona?.tipo !== 'sitio') return null;
  if (sesion.tipo === 'admin') return { zona: 'admin' };
  const tiendas = await miembrosRepo.tiendasDeUsuario(sesion.usuarioId);
  return {
    zona: 'tiendas',
    tiendas: tiendas.map(({ slug, nombre }) => ({ slug, nombre })),
  };
}
