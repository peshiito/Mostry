import { urlPublica } from '../../../shared/archivos/almacenamiento.js';
import { db } from '../../../shared/db/db.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { LADO_ANIMADO, LADOS_FOTO } from './procesarMedio.js';

type Fila = {
  id: number;
  clave: string;
  tipo: 'foto' | 'animado';
  ancho: number;
  alto: number;
};

// Un medio listo para mostrar: url grande y chica (el animado tiene una sola).
export const medioPublico = (m: Fila) => {
  const grande = m.tipo === 'foto' ? LADOS_FOTO[0] : LADO_ANIMADO;
  const chica = m.tipo === 'foto' ? LADOS_FOTO[1] : LADO_ANIMADO;
  return {
    id: m.id,
    tipo: m.tipo,
    ancho: m.ancho,
    alto: m.alto,
    url: urlPublica(`${m.clave}-${grande}.webp`),
    urlChica: urlPublica(`${m.clave}-${chica}.webp`),
  };
};

const columnas = ['id', 'clave', 'tipo', 'ancho', 'alto'] as const;

export const listarMedios = (tiendaId: TiendaId) =>
  db
    .selectFrom('mediosTienda')
    .select(columnas)
    .where('tiendaId', '=', tiendaId)
    .orderBy('id', 'desc')
    .execute()
    .then((f) => f.map(medioPublico));

// Solo los medios de ESTA tienda que pide la página (para la vidriera).
export async function mediosPorId(tiendaId: TiendaId, ids: number[]) {
  if (!ids.length) return [];
  const filas = await db
    .selectFrom('mediosTienda')
    .select(columnas)
    .where('tiendaId', '=', tiendaId)
    .where('id', 'in', ids)
    .execute();
  return filas.map(medioPublico);
}

// La página solo puede usar imágenes de su propia biblioteca.
export async function exigirMediosPropios(tiendaId: TiendaId, ids: number[]) {
  const unicos = [...new Set(ids)];
  if ((await mediosPorId(tiendaId, unicos)).length !== unicos.length)
    throw new AppError(
      400,
      'medio_ajeno',
      'Una de las imágenes ya no está en tu biblioteca.',
    );
}
