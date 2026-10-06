import { z } from 'zod';
import { MAX_CATEGORIAS, MAX_FOTOS } from './limites.js';
import { idBody } from './schemas.js';

const sinRepetidos = (ids: number[]) => new Set(ids).size === ids.length;

// Para reordenar se mandan TODOS los ids, en el orden nuevo.
export const esquemaOrden = z.strictObject({
  ids: z
    .array(idBody)
    .max(MAX_CATEGORIAS)
    .refine(sinRepetidos, 'Hay categorías repetidas'),
});

export const esquemaOrdenFotos = z.strictObject({
  ids: z.array(idBody).max(MAX_FOTOS).refine(sinRepetidos, 'Hay fotos repetidas'),
});
