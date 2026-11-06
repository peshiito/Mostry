import { CARGAS } from './cargas.js';

const cargadas = new Set();

// Baja (una sola vez) las tipografías que usa la tienda. Si falla la descarga,
// la vidriera sigue con la de respaldo: nunca bloquea la página.
export function cargarFuentes(claves) {
  for (const clave of claves) {
    const carga = CARGAS[clave];
    if (!carga || cargadas.has(clave)) continue;
    cargadas.add(clave);
    carga().catch(() => cargadas.delete(clave));
  }
}
