// Como mucho 2 imágenes procesándose a la vez en todo el proceso: el resto
// espera su turno. Evita que muchas subidas simultáneas agoten la memoria.
const MAX_EN_PARALELO = 2;
let activos = 0;
const esperando: (() => void)[] = [];

export async function conTurno<T>(tarea: () => Promise<T>): Promise<T> {
  if (activos >= MAX_EN_PARALELO)
    await new Promise<void>((listo) => esperando.push(listo));
  activos++;
  try {
    return await tarea();
  } finally {
    activos--;
    esperando.shift()?.();
  }
}
