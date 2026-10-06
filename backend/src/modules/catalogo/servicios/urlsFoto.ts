import { urlPublica } from '../../../shared/archivos/almacenamiento.js';
import { clavesDeFoto } from '../../../shared/archivos/claves.js';

// El panel y la tienda reciben URLs, nunca claves internas del bucket.
export function presentarFoto(f: { id: number; clave: string; orden: number }) {
  const claves = clavesDeFoto(f.clave);
  return {
    id: f.id,
    orden: f.orden,
    grande: urlPublica(claves.grande),
    chica: urlPublica(claves.chica),
  };
}
