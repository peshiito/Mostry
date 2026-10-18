// HSTS de la API (S3): 1 año con subdominios, sin preload (se pide después del
// piloto). Solo con https y un dominio real: en *.localhost (la prueba con Caddy)
// fijaría https para todo mostry.localhost en el navegador por un año.
export function opcionesHsts(c: { ORIGEN_PROTOCOLO: string; DOMINIO_BASE: string }) {
  const local = c.DOMINIO_BASE === 'localhost' || c.DOMINIO_BASE.endsWith('.localhost');
  if (c.ORIGEN_PROTOCOLO !== 'https' || local) return false as const;
  return { maxAge: 31_536_000, includeSubDomains: true, preload: false };
}
