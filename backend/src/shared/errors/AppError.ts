// Error esperado: su mensaje es seguro para mostrarle al cliente.
export class AppError extends Error {
  constructor(
    readonly status: number,
    readonly codigo: string,
    mensaje: string,
  ) {
    super(mensaje);
    this.name = 'AppError';
  }
}
