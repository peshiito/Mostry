import { z } from 'zod';

// Piezas comunes de los bloques. Un link nunca es un texto suelto: es un destino
// con forma (el frontend arma el href), así no entra un javascript: ni un
// sitio raro por la ventana.
export const idBloque = z.string().regex(/^[a-z0-9]{6,16}$/);
export const textoOpcional = (max: number) => z.string().trim().max(max).nullable();
const idPositivo = z.number().int().positive().max(2_147_483_647);

export const esquemaDestino = z.discriminatedUnion('tipo', [
  z.strictObject({ tipo: z.literal('catalogo') }),
  z.strictObject({ tipo: z.literal('categoria'), id: idPositivo }),
  z.strictObject({ tipo: z.literal('producto'), id: idPositivo }),
  z.strictObject({ tipo: z.literal('whatsapp') }),
  z.strictObject({ tipo: z.literal('seccion'), id: idBloque }),
  z.strictObject({ tipo: z.literal('web'), url: z.url({ protocol: /^https$/ }).max(200) }),
]);

export const esquemaBoton = z.strictObject({
  texto: z.string().trim().min(1).max(30),
  destino: esquemaDestino,
});

// De dónde salen los productos de un carrusel o una grilla.
export const esquemaFuente = z.discriminatedUnion('tipo', [
  z.strictObject({ tipo: z.literal('destacados') }),
  z.strictObject({ tipo: z.literal('todos') }),
  z.strictObject({ tipo: z.literal('categoria'), id: idPositivo }),
  z.strictObject({ tipo: z.literal('elegidos'), ids: z.array(idPositivo).min(1).max(24) }),
]);
