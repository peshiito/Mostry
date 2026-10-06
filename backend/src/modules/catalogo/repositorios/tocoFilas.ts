// true si un UPDATE afectó exactamente n filas.
export const tocoFilas = (r: { numUpdatedRows: bigint }, n: number) =>
  r.numUpdatedRows === BigInt(n);
