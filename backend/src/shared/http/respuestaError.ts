import type { Response } from 'express';

export type CampoInvalido = { campo: string; mensaje: string };

// Formato único de error para toda la API.
export function responderError(
  res: Response,
  status: number,
  codigo: string,
  mensaje: string,
  campos?: CampoInvalido[],
): void {
  res.status(status).json({ error: { codigo, mensaje, ...(campos && { campos }) } });
}
