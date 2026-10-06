// true si MySQL rechazó el dato por violar ESA FK (la fila referenciada no
// existe o es de otra tienda: las FK son compuestas con tienda_id).
export function esFkInvalida(err: unknown, constraint: string): boolean {
  if (typeof err !== 'object' || err === null) return false;
  const { code, message } = err as { code?: string; message?: string };
  return code === 'ER_NO_REFERENCED_ROW_2' && String(message).includes(constraint);
}
