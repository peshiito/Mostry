import { PUERTO_API } from './entorno.js';

// Fuerza respuestas de la API de prueba para ver cada estado de error o de carga
// sin romper nada de verdad. Solo intercepta la API, nunca las páginas.
export const API = `http://api.mostry.localhost:${PUERTO_API}`;

export const respuesta = (status, codigo = 'error', mensaje = 'Algo salió mal.') => ({
  status,
  contentType: 'application/json',
  body: JSON.stringify({ error: { codigo, mensaje } }),
});

// Cada vez que se pida `ruta` a la API (hasta unrouteAll), responde con ese status.
export const forzar = (page, ruta, status, codigo) =>
  page.route(`${API}${ruta}`, (r) => r.fulfill(respuesta(status, codigo)));

// Hace esperar `ms` a la API antes de contestar de verdad.
export const demorar = (page, ruta, ms) =>
  page.route(`${API}${ruta}`, async (r) => {
    await new Promise((listo) => setTimeout(listo, ms));
    await r.continue();
  });

// Subida lenta de verdad (Chromium): limita la velocidad de subida de la red.
export async function redLenta(page, bytesPorSegundo = 12_000) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 40,
    downloadThroughput: -1,
    uploadThroughput: bytesPorSegundo,
  });
}
