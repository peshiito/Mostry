// Opciones válidas del tema de una tienda. Las fuentes y los patrones tienen que
// coincidir con frontend/src/shared/temaTienda (lo controla un test del frontend).
export { FUENTES, FUENTES_TEXTO } from './fuentesTema.js';

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
