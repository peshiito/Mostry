// Opciones válidas del tema de una tienda. Las fuentes y los patrones tienen que
// coincidir con frontend/src/shared/temaTienda (lo controla un test del frontend).
export const FUENTES = [
  'rubik',
  'work-sans',
  'vollkorn',
  'fraunces',
  'young-serif',
  'playfair',
  'bodoni',
  'lora',
  'bebas',
  'anton',
  'oswald',
  'marker',
  'spray',
  'sedgwick',
  'patrick',
  'caveat',
  'pacifico',
  'fredoka',
  'baloo',
  'bricolage',
  'syne',
  'space-grotesk',
  'nunito-sans',
  'nunito',
  'inter',
  'archivo',
  'dm-sans',
] as const;

// Las que se leen bien en párrafos: solo estas pueden ir como fuente de texto.
export const FUENTES_TEXTO = [
  'work-sans',
  'vollkorn',
  'lora',
  'space-grotesk',
  'nunito-sans',
  'nunito',
  'inter',
  'archivo',
  'dm-sans',
] as const;

export const PATRONES = [
  'ninguno',
  'harina',
  'pared',
  'renglones',
  'cuadrille',
  'rayas',
  'confites',
  'hojas',
  'puntos',
  'ladrillo',
  'madera',
  'pizarra',
  'kraft',
  'flores',
  'toldo',
  'ondas',
] as const;

export const FORMAS = ['recta', 'suave', 'redonda'] as const;
export const ENCABEZADOS = ['toldo', 'portada', 'minimo'] as const;
export const PLANTILLAS = ['clasica', 'vitrina', 'galeria'] as const;
