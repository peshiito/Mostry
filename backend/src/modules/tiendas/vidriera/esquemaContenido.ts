import { z } from 'zod';

export const SECCIONES = [
  'promo',
  'categorias',
  'destacados',
  'club',
  'catalogo',
  'nosotros',
  'galeria',
  'envios',
] as const;

// Link de una red: https y del dominio de esa red (nada de javascript: ni de
// sitios que se hagan pasar por la red).
const red = (dominios: string[]) =>
  z
    .url({ protocol: /^https$/ })
    .max(200)
    .refine((u) => {
      const host = new URL(u).hostname.replace(/^www\./, '');
      return dominios.some((d) => host === d || host.endsWith(`.${d}`));
    }, 'Ese link no es de esa red')
    .nullable()
    .optional();

export const esquemaContenido = z.strictObject({
  sobreNosotros: z.string().trim().max(1200).nullable().optional(),
  redes: z
    .strictObject({
      instagram: red(['instagram.com']),
      tiktok: red(['tiktok.com']),
      facebook: red(['facebook.com', 'fb.com']),
      web: z
        .url({ protocol: /^https$/ })
        .max(200)
        .nullable()
        .optional(),
    })
    .optional(),
  // El orden y cuáles se ven; cada una una sola vez.
  secciones: z
    .array(
      z.strictObject({
        id: z.enum(SECCIONES),
        visible: z.boolean(),
        titulo: z.string().trim().min(1).max(40).nullable().optional(),
      }),
    )
    .max(SECCIONES.length)
    .refine((s) => new Set(s.map((x) => x.id)).size === s.length, 'Sección repetida')
    .optional(),
});

export type ContenidoTienda = z.infer<typeof esquemaContenido>;
