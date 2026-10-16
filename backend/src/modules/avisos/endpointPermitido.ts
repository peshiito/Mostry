import { config } from '../../config/env.js';

// Anti-SSRF: el servidor le hace un POST a la URL que eligió el navegador.
// Solo se aceptan los servicios de push de los navegadores, siempre por https.
// Lo que se guarda y se usa es exactamente lo validado.
const SERVICIOS = [
  /^fcm\.googleapis\.com$/, // Chrome, Edge, Android
  /^([a-z0-9-]+\.)*push\.services\.mozilla\.com$/, // Firefox
  /^([a-z0-9-]+\.)*push\.apple\.com$/, // Safari e iPhone
  /^([a-z0-9-]+\.)*notify\.windows\.com$/, // Windows
];

const extra = () =>
  (config.AVISOS_HOSTS_EXTRA ?? '')
    .split(',')
    .map((h) => h.trim())
    .filter(Boolean);

export function endpointPermitido(endpoint: string): boolean {
  let url: URL;
  try {
    url = new URL(endpoint);
  } catch {
    return false;
  }
  // Tiene que venir ya normalizada: "https:///host" o "https://\\host" se leen
  // distinto con url.parse (el que usa web-push) y podrían ir a localhost.
  if (url.href !== endpoint) return false;
  if (url.protocol !== 'https:' || url.port || url.username || url.password) return false;
  return SERVICIOS.some((re) => re.test(url.hostname)) || extra().includes(url.hostname);
}
