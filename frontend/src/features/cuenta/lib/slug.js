// Subdominios reservados (6.5) y formato del link de la tienda.
const RESERVADOS = [
  'admin',
  'www',
  'api',
  'app',
  'panel',
  'mail',
  'static',
  'soporte',
  'ayuda',
  'blog',
];

export const limpiarSlug = (t) =>
  t
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9-]/g, '')
    .slice(0, 30);

export function errorSlug(slug) {
  if (slug.length < 3) return 'Mínimo 3 letras.';
  if (/^-|-$/.test(slug)) return 'No puede empezar ni terminar con guion.';
  if (RESERVADOS.includes(slug)) return 'Ese nombre no se puede usar.';
  return null;
}
