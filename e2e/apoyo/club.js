import { CLAVE, PUERTO_API, URL_SITIO, urlTienda } from './entorno.js';
import { ultimoCodigo } from './mailpit.js';

const API = `http://api.mostry.localhost:${PUERTO_API}`;

// Pedidos a la API con las cookies del contexto del navegador (page.request).
const llamar = async (page, metodo, ruta, origen, data) => {
  const r = await page.request.fetch(API + ruta, {
    method: metodo,
    headers: { Origin: origen },
    data,
  });
  if (!r.ok()) throw new Error(`${metodo} ${ruta} → ${r.status()} ${await r.text()}`);
  return r.json().catch(() => null);
};

// Un cliente nuevo del Club con su sesión en este navegador.
export async function clienteDelClub(page, nombre = 'Ana Club') {
  const email = `club-${Date.now().toString(36)}@prueba.test`;
  const datos = {
    email,
    clave: CLAVE,
    nombre,
    whatsapp: '11 5555-1234',
    aceptoTerminos: true,
  };
  await llamar(page, 'POST', '/club/registro', URL_SITIO, datos);
  const codigo = await ultimoCodigo(email);
  await llamar(page, 'POST', '/club/verificar-email', URL_SITIO, {
    email,
    codigo,
    clave: CLAVE,
  });
  return email;
}

export const codigoQr = async (page) =>
  (await llamar(page, 'GET', '/club/qr', URL_SITIO)).codigo;

// Doña Rosa prende un club simple: suma con cualquier compra; a los 2, 50 %.
export const clubDeRosa = (page) =>
  llamar(page, 'PUT', '/panel/club', urlTienda('dona-rosa'), {
    nombre: 'Club Doña Rosa',
    compraMinima: 0,
    venceMeses: null,
    premios: [
      { compras: 2, tipo: 'porcentaje', valor: 50, tope: null, descripcion: null },
    ],
  }).then(() =>
    llamar(page, 'PATCH', '/panel/club/activo', urlTienda('dona-rosa'), { activo: true }),
  );
