import { z } from 'zod';
import { datosBanner, datosHero } from './esquemaPortada.js';
import {
  esquemaFuente,
  idBloque,
  idPositivo,
  textoOpcional as opc,
} from './esquemaDestino.js';

// Cada bloque: id, tipo, si se ve y sus datos (objetos estrictos). Los títulos en
// null usan el texto de siempre ("Lo más pedido", el nombre de la tienda...).
const bloque = <T extends string, D extends z.ZodType>(tipo: T, datos: D) =>
  z.strictObject({ id: idBloque, tipo: z.literal(tipo), visible: z.boolean(), datos });
const vacio = z.strictObject({});

export const BLOQUES = [
  bloque('hero', datosHero),
  bloque('beneficios', vacio),
  bloque(
    'categorias',
    z.strictObject({
      titulo: opc(60),
      forma: z.enum(['circulos', 'tarjetas']),
      // Cuáles mostrar (vacío = todas). Con valor por defecto: las páginas de antes siguen valiendo.
      ids: z.array(idPositivo).max(24).default([]),
    }),
  ),
  bloque(
    'productos',
    z.strictObject({
      titulo: opc(60),
      bajada: opc(120),
      vista: z.enum(['carrusel', 'grilla']),
      fuente: esquemaFuente,
      cantidad: z.number().int().min(1).max(48),
      automatico: z.boolean().default(false),
    }),
  ),
  bloque('banner', datosBanner),
  bloque(
    'texto',
    z.strictObject({
      titulo: opc(80),
      cuerpo: z.string().trim().min(1).max(1500),
      alineacion: z.enum(['izquierda', 'centro']),
    }),
  ),
  bloque(
    'destacado',
    z.strictObject({
      productoId: idPositivo,
      titulo: opc(80),
      texto: opc(300),
      lado: z.enum(['izquierda', 'derecha']),
    }),
  ),
  bloque('nosotros', z.strictObject({ titulo: opc(60) })),
  bloque('galeria', z.strictObject({ titulo: opc(60) })),
  bloque('cierre', z.strictObject({ titulo: opc(80), texto: opc(200) })),
  bloque('club', vacio),
  bloque(
    'separador',
    z.strictObject({ tamano: z.enum(['chico', 'medio', 'grande']), linea: z.boolean() }),
  ),
] as const;

export const esquemaBloque = z.discriminatedUnion('tipo', BLOQUES);
export type Bloque = z.infer<typeof esquemaBloque>;
