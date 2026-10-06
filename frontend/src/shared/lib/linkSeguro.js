// Solo links https de Google Maps (la API ya los valida; esto es una segunda capa).
const HOSTS = [
  'maps.app.goo.gl',
  'goo.gl',
  'www.google.com',
  'maps.google.com',
  'google.com',
];

export function linkMapsSeguro(u) {
  try {
    const x = new URL(u);
    return x.protocol === 'https:' && HOSTS.includes(x.hostname) ? x.href : null;
  } catch {
    return null;
  }
}
