// true si el error es de MySQL por violar la clave única indicada.
export function esDuplicado(err: unknown, claveUnica: string): boolean {
  if (typeof err !== 'object' || err === null) return false;
  const { code, message } = err as { code?: string; message?: string };
  return code === 'ER_DUP_ENTRY' && String(message).includes(claveUnica);
}
