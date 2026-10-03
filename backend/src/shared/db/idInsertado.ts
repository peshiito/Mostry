// Id generado por un INSERT de MySQL.
export function idInsertado(resultado: { insertId?: bigint }): number {
  if (resultado.insertId === undefined) throw new Error('El INSERT no devolvió id');
  return Number(resultado.insertId);
}
