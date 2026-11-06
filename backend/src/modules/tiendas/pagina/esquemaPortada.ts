import { z } from 'zod';
import { esquemaBoton, idPositivo, textoOpcional as opc } from './esquemaDestino.js';

// Imágenes propias (de la biblioteca de la tienda): con 2 o más, la portada es
// un carrusel. Los campos nuevos tienen valor por defecto, así las páginas
// guardadas antes de P3 siguen siendo válidas.
const medios = z.array(idPositivo).max(6).default([]);
const carrusel = z
  .strictObject({
    segundos: z.number().int().min(2).max(10),
    transicion: z.enum(['fundido', 'deslizar']),
  })
  .default({ segundos: 5, transicion: 'fundido' });

export const datosHero = z
  .strictObject({
    titulo: opc(80),
    frase: opc(160),
    imagen: z.enum(['portada', 'producto', 'ninguna', 'propia']),
    medios,
    carrusel,
    botones: z.array(esquemaBoton).max(2),
  })
  .refine(
    (d) => d.imagen !== 'propia' || d.medios.length > 0,
    'Elegí al menos una imagen',
  );

export const datosBanner = z.strictObject({
  origen: z.enum(['promo', 'propio']),
  titulo: opc(80),
  texto: opc(240),
  boton: esquemaBoton.nullable(),
  imagen: z.enum(['producto', 'ninguna', 'propia']),
  medio: idPositivo.nullable().default(null),
});

// Los ids de imágenes que usa una página (para verificar que son de la tienda).
export const mediosDePagina = (bloques: { tipo: string; datos: object }[]) =>
  bloques.flatMap((b) => {
    const d = b.datos as { medios?: number[]; medio?: number | null };
    return [...(d.medios ?? []), ...(d.medio ? [d.medio] : [])];
  });
