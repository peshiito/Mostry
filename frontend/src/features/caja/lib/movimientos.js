// Ayudas de la pantalla de caja.

export const MENSAJES_CAJA = {
  abrir: 'Caja abierta',
  cerrar: 'Caja cerrada',
  movimientos: 'Movimiento anotado',
};

// Los de la caja + los del día que no entraron en ella (por ejemplo, una
// transferencia aprobada después de cerrar: entra igual, sección 6.4). Sin repetir.
export function unirMovimientos(deCaja = [], delDia = []) {
  const porId = new Map([...deCaja, ...delDia].map((m) => [m.id, m]));
  return [...porId.values()].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
}
