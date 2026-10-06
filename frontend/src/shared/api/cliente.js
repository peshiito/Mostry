// Cliente HTTP único para la API. La sesión viaja en una cookie httpOnly
// (credentials: 'include'): nunca guardamos tokens en el navegador (sección 7).
const BASE = import.meta.env.VITE_API_URL ?? 'http://api.mostry.localhost:3000';

export class ErrorApi extends Error {
  constructor(status, error = {}) {
    super(error.mensaje ?? 'Algo salió mal. Probá de nuevo en un rato.');
    this.status = status;
    this.codigo = error.codigo ?? 'error_red';
    this.campos = error.campos ?? [];
    this.detalle = error.detalle;
  }
}

export async function api(ruta, { metodo = 'GET', cuerpo, archivo, senal } = {}) {
  let res;
  try {
    res = await fetch(BASE + ruta, {
      method: metodo,
      credentials: 'include',
      signal: senal,
      headers: cuerpo !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: archivo ?? (cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined),
    });
  } catch (e) {
    if (e.name === 'AbortError') throw e;
    throw new ErrorApi(0, {
      codigo: 'sin_conexion',
      mensaje: 'No pudimos conectarnos. Revisá tu internet.',
    });
  }
  if (res.status === 204) return null;
  const datos = await res.json().catch(() => null);
  if (!res.ok) throw new ErrorApi(res.status, datos?.error);
  return datos;
}

// Campos inválidos de Zod → { campo: mensaje } para mostrarlos junto a cada input.
export const erroresDeCampos = (e) =>
  Object.fromEntries((e?.campos ?? []).map((c) => [c.campo, c.mensaje]));
