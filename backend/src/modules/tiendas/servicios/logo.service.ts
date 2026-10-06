import type { TiendaId } from '../../../shared/db/tiendaId.js';
import {
  borrarPublicos,
  subirWebp,
  urlPublica,
} from '../../../shared/archivos/almacenamiento.js';
import { claveLogo, LADO_LOGO } from '../../../shared/archivos/claves.js';
import { logoAWebp } from '../../../shared/archivos/procesarLogo.js';
import { validarImagen } from '../../../shared/archivos/validarImagen.js';
import { reemplazarLogo } from '../logo.repository.js';

// Nunca SVG ni el archivo original: solo un WebP reprocesado y normalizado.
export async function subirLogo(tiendaId: TiendaId, archivo: Buffer) {
  await validarImagen(archivo);
  const webp = await logoAWebp(archivo, LADO_LOGO);
  const clave = claveLogo(tiendaId);

  let anterior: string | null;
  try {
    await subirWebp(clave, webp);
    anterior = await reemplazarLogo(tiendaId, clave);
  } catch (err) {
    await borrarPublicos(tiendaId, [clave]);
    throw err;
  }
  if (anterior) await borrarPublicos(tiendaId, [anterior]);
  return { logoUrl: urlPublica(clave) };
}

export async function quitarLogo(tiendaId: TiendaId) {
  const anterior = await reemplazarLogo(tiendaId, null);
  if (anterior) await borrarPublicos(tiendaId, [anterior]);
}
