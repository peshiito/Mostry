// Link de Google Maps que pega el comprador y ve el comerciante: solo https y
// dominios de Google Maps. Nada de javascript:, http: ni sitios de phishing.
const HOSTS_CORTOS = new Set(['maps.app.goo.gl']);
const HOSTS_GOOGLE = new Set([
  'google.com',
  'www.google.com',
  'maps.google.com',
  'google.com.ar',
  'www.google.com.ar',
  'maps.google.com.ar',
  'goo.gl',
]);

export function esLinkMapsValido(texto: string): boolean {
  if (texto.length > 500) return false;
  let url: URL;
  try {
    url = new URL(texto);
  } catch {
    return false;
  }
  if (url.protocol !== 'https:' || url.username || url.password || url.port) return false;
  if (HOSTS_CORTOS.has(url.hostname)) return true;
  return (
    HOSTS_GOOGLE.has(url.hostname) &&
    (url.pathname.startsWith('/maps') || url.hostname.startsWith('maps.'))
  );
}
