import type { Response } from 'express';

type CampoInvalido = { campo: string; mensaje: string };
type Extra = { campos?: CampoInvalido[]; detalle?: Record<string, unknown> };

// Formato único de error para toda la API.
export function responderError(
  res: Response,
  status: number,
  codigo: string,
  mensaje: string,
  extra: Extra = {},
): void {
  res.status(status).json({ error: { codigo, mensaje, ...extra } });
}
