type Primitivo = string | number | boolean | null;

// Lo que puede viajar al cliente en "detalle": solo valores simples (nunca un
// Error, una fila de la base ni objetos anidados que puedan filtrar datos).
export type DetallePublico = Record<
  string,
  Primitivo | readonly Primitivo[] | readonly Record<string, Primitivo>[]
>;

// Error esperado: su mensaje (y su detalle, si tiene) es seguro para mostrarle al cliente.
export class AppError extends Error {
  constructor(
    readonly status: 400 | 401 | 403 | 404 | 409 | 410 | 413 | 429,
    readonly codigo: string,
    mensaje: string,
    readonly detalle?: DetallePublico,
  ) {
    super(mensaje);
    this.name = 'AppError';
  }
}
