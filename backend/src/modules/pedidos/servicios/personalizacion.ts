import { AppError } from '../../../shared/errors/AppError.js';

// Encargos 2: lo que pide personalización se encarga diciendo cómo se quiere;
// el resto (y toda compra al toque) no lleva personalización.
export function personalizacionDelItem(
  tipo: 'inmediato' | 'encargo',
  p: { id: number; nombre: string; pidePersonalizacion: boolean },
  texto: string | undefined,
  manual = false, // cargado por el comerciante: anota lo que quiera, sin exigir
): string | null {
  if (manual) return texto ?? null;
  const admite = tipo === 'encargo' && p.pidePersonalizacion;
  if (texto && !admite)
    throw new AppError(
      400,
      'personalizacion_no_admitida',
      `"${p.nombre}" no se personaliza.`,
      { productoId: p.id },
    );
  if (admite && !texto)
    throw new AppError(
      400,
      'falta_personalizacion',
      `Contanos cómo querés "${p.nombre}".`,
      { productoId: p.id },
    );
  return texto ?? null;
}
